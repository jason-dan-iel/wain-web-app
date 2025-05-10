import React from "react";

function DamDetails({ dam, onClose }) {
  return (
    <div className="dam-details">
      <button className="close-btn" onClick={onClose}>Close</button>
      <h2>{dam["Station name"]}</h2>
      <table>
        <tbody>
          {Object.entries(dam).map(([key, value]) => (
            <tr key={key}>
              <td style={{fontWeight:"bold"}}>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DamDetails;