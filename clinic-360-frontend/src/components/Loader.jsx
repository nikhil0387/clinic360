import { Loader2 } from "lucide-react";

const Loader = ({ className }) => (
  <Loader2 className={`animate-spin ${className}`} />
);

export default Loader;
