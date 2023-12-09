const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            productos: [],
            url: 'https://carladlp.pythonanywhere.com/cafeteria/productos',
            error: false,
            cargando: true,
            id: 0,
            nombre: '',
            precio: 0,
            imagen: ''
        };
    },
    methods: {
        fetchData() {   //fech se usa para GET(leer)
            fetch(this.url)
                .then(response => response.json())
                .then(data => {
                    console.log(data);  //  para imprimir en pantalla
                    this.productos = data;
                    this.cargando = false;
                })
                .catch(err => {
                    console.error(err);
                    this.error = true;
                });
        },
        agregarProducto() {   // POST y PUT
            const nuevoProducto = {
                nombre: this.nombre,
                precio: this.precio,
                imagen: this.imagen
            };

            if (this.id === null || this.id === undefined) {
                // Si id es nulo o no está definido, se trata de una creación (POST)
                this.crearProducto(nuevoProducto);
            } else {
                // Si id tiene un valor, se trata de una actualización (PUT)
                this.actualizarProducto(this.id, nuevoProducto);
            }
        },
        crearProducto(nuevoProducto) {
            const options = {
                body: JSON.stringify(nuevoProducto),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow'
            };

            fetch(this.url, options)
                .then(response => response.json())
                .then(() => {
                    this.fetchData();
                    this.resetForm();
                })
                .catch(err => {
                    console.error(err);
                    alert('Error al agregar producto');
                });
        },
        actualizarProducto(id, productoActualizado) {
            const url = `${this.url}/${id}`;

            const options = {
                body: JSON.stringify(productoActualizado),
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow'
            };

            fetch(url, options)
                .then(response => response.json())
                .then(() => {
                    this.fetchData();
                    this.resetForm();
                })
                .catch(err => {
                    console.error(err);
                    alert('Error al actualizar producto');
                });
        },
        eliminarProducto(id) {
            const url = `${this.url}/${id}`;

            const options = {
                method: 'DELETE'
            };

            fetch(url, options)
                .then(() => {
                    this.fetchData();
                })
                .catch(err => {
                    console.error(err);
                    alert('Error al eliminar producto');
                });
        },
        resetForm() {
            this.nombre = '';
            this.precio = 0;
            this.imagen = '';
        }
    }
});

// Monta la aplicación en el elemento con el id "app"
app.mount('#app');

// Llama a fetchData al crear la instancia de Vue
app.fetchData();
