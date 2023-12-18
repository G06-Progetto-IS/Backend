const mongoose = require('mongoose');
const port = process.env.PORT || 7023;

mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) return console.error("Error:", err);
    console.log("MongoDB Connection -- Ready state is: ", mongoose.connection.readyState);
  }
);


const listener = app.listen(process.env.PORT || 7023, () =>{
    console.log("Server in ascolto sulla porta : " + listener.address().port)
});

module.export = app;