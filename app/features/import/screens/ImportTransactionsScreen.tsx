import { AppTheme } from '@/app/core/theme/theme';
import { Transaction } from '@/app/core/types/transaction';
import { useTransactions } from '@/app/shared/hooks/useTransactions';
import { categorizeByDescription, inferTypeFromCategory, normalizeCategory } from '@/app/utils/autoCategorizer';
import { formatDateToISO } from '@/app/utils/dateFormatting';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Appbar, Modal, Portal, useTheme } from 'react-native-paper';
import * as XLSX from 'xlsx';
import { ColumnMapper } from '../components/ColumnMapper';
import { FileSelector } from '../components/FileSelector';
import { ImportPreview } from '../components/ImportPreview';

export const ImportTransactionsScreen = () => {
    const { colors } = useTheme<AppTheme>();
    const navigation = useNavigation();
    const { importTransactions } = useTransactions();
    const [step, setStep] = useState<number>(1);
    const [fileUri, setFileUri] = useState<string | null>(null);
    const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
    const [headers, setHeaders] = useState<string[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [parsedTransactions, setParsedTransactions] = useState<Partial<Transaction>[]>([]);
    const [detectedYear, setDetectedYear] = useState<number>(new Date().getFullYear());
    const [isSaving, setIsSaving] = useState(false);

    const handleFileSelected = async (uri: string) => {
        setFileUri(uri);
        try {
            const fileContent = await FileSystem.readAsStringAsync(uri, {
                encoding: 'base64',
            });
            const wb = XLSX.read(fileContent, { type: 'base64' });
            setWorkbook(wb);

            // Get first sheet
            const wsName = wb.SheetNames[0];
            const ws = wb.Sheets[wsName];

            // Convert to JSON to inspect data
            const rawData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

            let headerRowIndex = 0;
            let foundHeaders = false;

            // Simple heuristic: Look for a row containing "Fecha" or "Date" or "Descripcion"
            for (let i = 0; i < Math.min(rawData.length, 20); i++) {
                const row = rawData[i].map(c => String(c).toLowerCase());
                if (row.some((cell) => cell.includes('fecha') || cell.includes('date') || cell.includes('descripcion') || cell.includes('description'))) {
                    headerRowIndex = i;
                    foundHeaders = true;
                    break;
                }
            }

            if (foundHeaders || rawData.length > 0) {
                const headerRow = rawData[headerRowIndex].map(String);
                setHeaders(headerRow);

                // Try to detect year from metadata rows (before headerRowIndex)
                let detectedYearVal = new Date().getFullYear();
                let yearFound = false;

                for (let i = 0; i < headerRowIndex; i++) {
                    const row = rawData[i];
                    if (!row || !Array.isArray(row)) continue;

                    // Check strings
                    const rowStr = row.join(' ');
                    const yearMatch = rowStr.match(/(?:20)\d{2}/); // Match 20xx
                    if (yearMatch) {
                        detectedYearVal = parseInt(yearMatch[0], 10);
                        yearFound = true;
                        break;
                    }

                    // Check numbers (Excel Serial Dates)
                    // Excel dates are usually > 40000 for recent years (40000 is year 2009)
                    for (const cell of row) {
                        if (typeof cell === 'number' && cell > 43000 && cell < 60000) {
                            // Convert Excel date to JS Date
                            // Excel base date: Dec 30 1899 usually (25569 offset in days approx? Standard is (value - 25567 - 2) * 86400 * 1000)
                            // 25569 is Unix epoch start.
                            try {
                                const jsDate = new Date((cell - 25569) * 86400 * 1000);
                                const y = jsDate.getFullYear();
                                if (y >= 2000 && y <= 2100) {
                                    detectedYearVal = y;
                                    yearFound = true;
                                    break;
                                }
                            } catch (e) {
                                // ignore
                            }
                        }
                    }
                    if (yearFound) break;
                }

                // Allow user override? For now just log
                console.log("Detected Year from file:", detectedYearVal);
                setDetectedYear(detectedYearVal);

                // Get data starting from next row, using keys from headerRow
                // sheet_to_json doesn't support "range" as offset easily for object mapping unless we pass range.
                // Cleaner way: use range option in sheet_to_json
                const range = XLSX.utils.decode_range(ws['!ref'] || "A1");
                range.s.r = headerRowIndex; // Start reading from header row
                const dataWithHeaders = XLSX.utils.sheet_to_json(ws, { range: range });

                setData(dataWithHeaders);
                setStep(2);
            } else {
                Alert.alert("Error", "El archivo parece estar vacío.");
            }
        } catch (error) {
            console.error("Error parsing excel:", error);
            Alert.alert("Error", "No se pudo leer el archivo Excel.");
        }
    };

    const handleMappingComplete = (map: Record<string, string>) => {
        setMapping(map);
        processData(map);
        setStep(3);
    };

    const processData = (map: Record<string, string>) => {
        try {
            const result: Partial<Transaction>[] = data.map((row: any) => {
                let dateStr = String(row[map.date] || '');
                let amountStr = String(row[map.amount] || '0').trim();

                // Remove currency symbols and spaces
                amountStr = amountStr.replace(/[^0-9.,-]/g, '');

                let amount = 0;

                // Heuristic for Decimal Separator
                if (amountStr.includes(',') && amountStr.includes('.')) {
                    if (amountStr.lastIndexOf(',') > amountStr.lastIndexOf('.')) {
                        // 1.200,50 -> Comma is decimal
                        amountStr = amountStr.replace(/\./g, '').replace(',', '.');
                    } else {
                        // 1,200.50 -> Dot is decimal
                        amountStr = amountStr.replace(/,/g, '');
                    }
                } else if (amountStr.includes(',')) {
                    // Ambiguous case: "10,00" vs "1,200". 
                    // Assume comma is decimal if it looks like coordinate/money (e.g. 2 decimals at end)
                    // Or if there are multiple commas (1,000,000) -> thousands.
                    const parts = amountStr.split(',');
                    if (parts.length > 2) {
                        // Multiple commas -> thousands separator -> remove
                        amountStr = amountStr.replace(/,/g, '');
                    } else {
                        // Single comma -> decimal separator
                        amountStr = amountStr.replace(',', '.');
                    }
                }

                amount = parseFloat(amountStr);

                // Handle Excel serial date
                if (typeof row[map.date] === 'number') {
                    const date = new Date((row[map.date] - (25567 + 2)) * 86400 * 1000);
                    dateStr = formatDateToISO(date);
                } else if (dateStr) {
                    // Try to parse common formats
                    // If it matches DD/MM/YYYY or DD-MM-YYYY
                    const dmyMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);

                    // New: Match DD-MM or DD/MM (without Year)
                    const dmMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})$/);

                    if (dmyMatch) {
                        const day = parseInt(dmyMatch[1], 10);
                        const month = parseInt(dmyMatch[2], 10);
                        let year = parseInt(dmyMatch[3], 10);
                        // Fix 2-digit year
                        if (year < 100) year += 2000;

                        // Construct ISO safely
                        const dateObj = new Date(year, month - 1, day);
                        dateStr = formatDateToISO(dateObj);
                    } else if (dmMatch) {
                        // Handle "15-10" format -> Use detected year from file metadata
                        const day = parseInt(dmMatch[1], 10);
                        const month = parseInt(dmMatch[2], 10);
                        const year = detectedYear; // Use state variable captured from header

                        const dateObj = new Date(year, month - 1, day);
                        dateStr = formatDateToISO(dateObj);
                    } else {
                        // Attempt fallback parsing/standardization
                        dateStr = formatDateToISO(dateStr);
                    }
                }

                // ... rest of logic ...
                let category = 'Importado';

                // 1. Try to get category from mapped column
                if (map.category && row[map.category]) {
                    category = String(row[map.category]);
                }
                // 2. If not mapped or empty, try auto-categorization
                if (category === 'Importado' || !category) {
                    category = categorizeByDescription(String(row[map.description] || ''));
                } else {
                    // Normalize the mapped category (e.g. "comida" -> "Alimentación")
                    category = normalizeCategory(category);
                }

                // Logic for Type Inference
                // Default based on sign
                let type: 'income' | 'expense' = amount < 0 ? 'expense' : 'income';
                if (amount < 0) amount = Math.abs(amount);

                // Override based on Category if it's strongly typed
                // (e.g. positive amount but category is "Food" -> it's an expense)
                // Only override if user didn't explicitly map a Type column, OR if the mapped type was ambiguous
                if (!map.type || !row[map.type]) {
                    // Check if category implies a type
                    const inferredType = inferTypeFromCategory(category);
                    // Use inferred type. 
                    // WARNING: If we have 'income' amount (positive) but inferred 'expense', we assume bank statement uses positive for debit? 
                    // This is common. 
                    if (inferredType === 'expense' && type === 'income') {
                        type = 'expense';
                    }
                }

                if (map.type && row[map.type]) {
                    const rawType = String(row[map.type]).toLowerCase();
                    if (rawType.includes('ingreso') || rawType.includes('income') || rawType.includes('abono') || rawType.includes('deposito')) {
                        type = 'income';
                    } else if (rawType.includes('gasto') || rawType.includes('egreso') || rawType.includes('compra') || rawType.includes('retiro') || rawType.includes('payment')) {
                        type = 'expense';
                    }
                }

                return {
                    description: String(row[map.description] || ''),
                    amount: isNaN(amount) ? 0 : Math.abs(amount),
                    date: dateStr,
                    type: type,
                    category: category,
                };
            }).filter(t => t.amount > 0 && t.description && t.date && !t.date.includes('Inválida'));

            // Deduplicate results (using a composite key)
            const uniqueMap = new Set();
            const uniqueResult = result.filter(item => {
                const key = `${item.date}-${item.description}-${item.amount}-${item.type}`;
                if (uniqueMap.has(key)) return false;
                uniqueMap.add(key);
                return true;
            });

            setParsedTransactions(uniqueResult);
        } catch (err) {
            console.error("Error processing data", err);
            Alert.alert("Error", "Error al procesar los datos.");
        }
    };

    const handleSave = async (transactionsToSave: Partial<Transaction>[]) => {
        setIsSaving(true);
        try {
            // Use React Query mutation instead of Redux
            await importTransactions(transactionsToSave as any);

            Alert.alert("Éxito", `${transactionsToSave.length} movimientos importados.`);
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Ocurrió un error al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                <Appbar.BackAction onPress={() => {
                    if (step > 1) setStep(step - 1);
                    else navigation.goBack();
                }} />
                <Appbar.Content title={step === 1 ? "Importar Excel" : step === 2 ? "Asignar Columnas" : "Vista Previa"} />
            </Appbar.Header>

            <View style={styles.content}>
                {step === 1 && (
                    <FileSelector onFileSelected={handleFileSelected} />
                )}
                {step === 2 && (
                    <ColumnMapper fileHeaders={headers} onMappingComplete={handleMappingComplete} />
                )}
                {step === 3 && (
                    <ImportPreview
                        transactions={parsedTransactions}
                        onConfirm={handleSave}
                        onCancel={() => setStep(2)}
                    />
                )}
            </View>

            <Portal>
                <Modal visible={isSaving} dismissable={false} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: colors.surface, padding: 24, borderRadius: 16, alignItems: 'center', elevation: 5 }}>
                        <ActivityIndicator size="large" />
                        <Text style={{ color: colors.onSurface, marginTop: 16, fontWeight: '600' }}>Guardando transacciones...</Text>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    }
});
