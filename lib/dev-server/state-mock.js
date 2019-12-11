import localForage from "localforage";

if( document.getElementById('dev-server') != null ){
  window.addEventListener('load', async function() {
    let body = document.getElementById('dev-server');
    let table = document.createElement("table");

    const keys = await localForage.keys();

    await Promise.all(
      keys.map(async function(key){
        const value = await localForage.getItem(key);

        let row = document.createElement("tr");
        let keyCell = document.createElement("td");
        let keyText = document.createTextNode(key);
        let valueCell = document.createElement("td");
        let valueText = document.createTextNode(value);

        row.appendChild(keyCell);
        row.appendChild(valueCell);
        keyCell.appendChild(keyText);
        valueCell.appendChild(valueText);

        table.appendChild(row);

        valueCell.addEventListener("click", async function(){
          const newValue = prompt(key);
          localForage.setItem(key, newValue);
          location.href = location.href;
        });
      })
    );

    body.appendChild(table);
  });
}
