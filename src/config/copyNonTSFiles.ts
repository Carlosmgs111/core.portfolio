import * as path from "path";
import * as fs from "fs-extra";
import * as glob from "glob";
import config from "../config";

const rootDir = path.resolve(path.dirname(path.dirname(__dirname)));
const srcDir = path.resolve(rootDir, "src");
const destDir = path.resolve(rootDir, "dist");
const ignorePatterns = ["**/*.ts", "**/*.tsx"];

async function copyNonTsFiles() {
  if (config.mode === "production") {
    console.log(
      "Estamos en modo producción. Eliminando directorio de distribución."
    );
    await fs.emptyDir(destDir);
  }
  const files = glob.sync("**/*", {
    cwd: srcDir,
    nodir: true,
    ignore: ignorePatterns,
  });

  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    await fs
      .ensureDir(path.dirname(destPath))
      .catch((err) => console.error("Error creando carpeta:", err));

    await fs
      .copyFile(srcPath, destPath)
      .catch((err) => console.error("Error copiando archivo:", err));
  }
}

copyNonTsFiles().catch((err) => {
  console.error("Error al copiar archivos:", err);
});
