import app from './app';
import { config } from './config/index';

// Start server
const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});