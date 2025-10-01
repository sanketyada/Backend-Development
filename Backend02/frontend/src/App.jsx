import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  let [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios
      .get("/api/jokes")
      .then((response) => {
        setJokes(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div style={{margin:"0 200px"}}>
      <p>Jokes Length={jokes.length}</p>
      {jokes.map((joke) => (
        <div style={{background:"teal", textAlign:"center"}} key={joke.id}>
          <h3>{joke.title}</h3>
          <p>{joke.content}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
