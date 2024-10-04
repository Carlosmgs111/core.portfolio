import "colors";
import "./modules";
import terminal from "./infrastructure/apis/terminal";

(async () => {
   await terminal();
})();
