import { createApp } from "./app";
import { env } from "./env";


const app = createApp();
const port = parseInt(env.PORT);


console.log('DATABASE_URL exists:', !!env.DATABASE_URL);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

export default app;