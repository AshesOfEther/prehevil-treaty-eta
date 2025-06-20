import { H3, serve } from "h3";

import api from "./api.ts";

serve(api, { port: 3000 });
