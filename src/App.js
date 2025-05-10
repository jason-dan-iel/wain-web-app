import React, { useEffect, useState } from "react";
import DamMap from "./DamMap";
import { readExcelFile } from "./utils";

function App() {
  const [dams, setDams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    readExcelFile("/dams.xlsx").then((rows) => {
      setDams(rows);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{padding:"2rem"}}>Loading dams...</div>;

  return (
    <div style={{height: "100vh", width: "100vw"}}>
      <DamMap dams={dams} />
    </div>
  );
}

export default App;