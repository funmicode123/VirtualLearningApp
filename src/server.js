// require('dotenv').config();
// const mongoose = require('mongoose');
// <<<<<<< HEAD
// const app = require('./app');
// =======
// const http = require('http');
// const { Server } = require('socket.io');
// const { swaggerUi, swaggerSpec } = require('./config/swagger');


// const MessageRoute = require('./routes/messageRoute')
// const ConversationRoute = require('./routes/conversationRoute')
// const SignUpRoute = require('./routes/signup.routes');
// const LoginRoute = require('./routes/login.routes')
// const initSocket = require('./config/socket'); 
// >>>>>>> 31929c3 (update on delete conversation)

// const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.MONGODB_URI;

// <<<<<<< HEAD
// =======
// const app = express();

// app.use(express.json());

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.use('/api', MessageRoute); 
// app.use('/conversationApi', ConversationRoute);
// app.use('/api/v1', SignUpRoute);
// app.use('/api/v1', LoginRoute);

// const server = http.createServer(app);


// >>>>>>> 31929c3 (update on delete conversation)
// if (!MONGODB_URI) {
//   console.error('MongoDB URI not defined in .env file');
//   process.exit(1);
// }

// mongoose.connect(MONGODB_URI)
// .then(() => {
//   console.log('MongoDB connected');
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// })
// .catch(err => {
//   console.error('MongoDB connection error:', err);
//   process.exit(1); 
// });

require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

const MessageRoute = require('./routes/messageRoute');
const ConversationRoute = require('./routes/conversationRoute');
const SignUpRoute = require('./routes/signup.routes');
const LoginRoute = require('./routes/login.routes');
const initSocket = require('./config/socket'); 

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', MessageRoute); 
app.use('/conversationApi', ConversationRoute);
app.use('/api/v1', SignUpRoute);
app.use('/api/v1', LoginRoute);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MongoDB URI not defined in .env file');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    const server = http.createServer(app);
    initSocket(server); // Initialize Socket.io
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
  });

