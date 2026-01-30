# Guía para Generar el APK (Android App Bundle / APK)

Para generar la aplicación instalable en Android, utilizaremos **EAS Build** de Expo.

## Prerrequisitos
1.  Tener una cuenta en [expo.dev](https://expo.dev/signup).
2.  Tener instalado EAS CLI: `npm install -g eas-cli`.

## Pasos

### 1. Login
Abre tu terminal y loguéate en Expo:
```bash
eas login
```

### 2. Configurar el Proyecto
Ejecuta la configuración inicial:
```bash
eas build:configure
```
- Selecciona `Android`.
- Esto creará un archivo `eas.json` en la raíz.

### 3. Configurar para APK (Opcional, para pruebas locales)
Por defecto, EAS genera un `.aab` (para Play Store). Si quieres un `.apk` instalable directamente, edita `eas.json` y añade esto dentro de `build`:

```json
"preview": {
  "android": {
    "buildType": "apk"
  }
}
```

### 4. Generar el Build
Para generar el APK de prueba:
```bash
eas build -p android --profile preview
```

Para generar la versión de producción (AAB para Play Store):
```bash
eas build -p android
```

¡Espera a que termine el proceso y te dará un link de descarga!
