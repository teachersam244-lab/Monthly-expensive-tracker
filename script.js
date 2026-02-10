document.addEventListener("DOMContentLoaded", () => {

    const lista = document.getElementById("lista");
    const btnAgregar = document.getElementById("btnAgregar");
    const btnReset = document.getElementById("btnReset");

    let gastos = [];
    let editIndex = null;

    // Cargar datos guardados
    cargarDesdeStorage();

    function formatoCOP(valor) {
        return valor.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0
        });
    }

    btnAgregar.addEventListener("click", guardarGasto);
    btnReset.addEventListener("click", () => {
        localStorage.removeItem("gastosPareja");
        gastos = [];
        render();
    });

    function guardarGasto() {
        const descripcion = document.getElementById("descripcion").value.trim();
        const monto = Number(document.getElementById("monto").value);
        const cantidad = Number(document.getElementById("cantidad").value);
        const categoria = document.getElementById("categoria").value;

        if (!descripcion || monto <= 0 || cantidad <= 0) {
            alert("Completa todos los campos correctamente");
            return;
        }

        const gasto = { descripcion, monto, cantidad, categoria };

        if (editIndex === null) {
            // Agregar
            gastos.push(gasto);
        } else {
            // Editar
            gastos[editIndex] = gasto;
            editIndex = null;
            btnAgregar.textContent = "Agregar";
        }

        guardarEnStorage();
        limpiarFormulario();
        render();
    }

    function render() {
        lista.innerHTML = "";

        let totalMercado = 0;
        let totalServicios = 0;
        let totalExtra = 0;

        gastos.forEach((g, index) => {
            const total = g.monto * g.cantidad;

            if (g.categoria === "mercado") totalMercado += total;
            if (g.categoria === "servicios") totalServicios += total;
            if (g.categoria === "extra") totalExtra += total;

            const fila = document.createElement("tr");
            fila.className = g.categoria;

            fila.innerHTML = `
                <td>${g.descripcion}</td>
                <td>${formatoCOP(total)}</td>
                <td>${g.categoria}</td>
                <td>
                    <button class="editar">✏️</button>
                    <button class="eliminar">🗑️</button>
                </td>
            `;

            fila.querySelector(".editar").addEventListener("click", () => cargarEdicion(index));
            fila.querySelector(".eliminar").addEventListener("click", () => eliminarGasto(index));

            lista.appendChild(fila);
        });

        document.getElementById("totalMercado").innerText = formatoCOP(totalMercado);
        document.getElementById("totalServicios").innerText = formatoCOP(totalServicios);
        document.getElementById("totalExtra").innerText = formatoCOP(totalExtra);
        document.getElementById("totalGeneral").innerText =
            formatoCOP(totalMercado + totalServicios + totalExtra);
    }

    function cargarEdicion(index) {
        const gasto = gastos[index];

        document.getElementById("descripcion").value = gasto.descripcion;
        document.getElementById("monto").value = gasto.monto;
        document.getElementById("cantidad").value = gasto.cantidad;
        document.getElementById("categoria").value = gasto.categoria;

        editIndex = index;
        btnAgregar.textContent = "Guardar cambios";
    }

    function eliminarGasto(index) {
        gastos.splice(index, 1);
        guardarEnStorage();
        render();
    }

    function limpiarFormulario() {
        document.getElementById("descripcion").value = "";
        document.getElementById("monto").value = "";
        document.getElementById("cantidad").value = 1;
        editIndex = null;
        btnAgregar.textContent = "Agregar";
    }

    function guardarEnStorage() {
        localStorage.setItem("gastosPareja", JSON.stringify(gastos));
    }

    function cargarDesdeStorage() {
        const data = localStorage.getItem("gastosPareja");
        if (data) {
            gastos = JSON.parse(data);
            render();
        }
    }
});
