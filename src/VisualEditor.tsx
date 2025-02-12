import { libs, dependencies } from "./sunmao/lib";
import registerSunmaoEditor from "./SunmaoEditor";
import "@sunmao-ui/editor/dist/index.css";
import "./init";

function VisualEditor() {
  const search = new URLSearchParams(location.search);
  const PageEditor = registerSunmaoEditor(
    { name: search.get("app") || "fiddle" },
    { libs, dependencies }
  );

  return <PageEditor />;
}

export default VisualEditor;
