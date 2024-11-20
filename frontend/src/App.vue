<template>
  <div class="container">

    <div class="image-container">
      <img :src="todoImage" alt="Todo" />
    </div>


    <div class="task-manager">
      <h1>Gestionnaire de Tâches</h1>


      <form @submit.prevent="isEdit ? updateTask() : addTask()" class="form">
        <input
            type="text"
            v-model="task.title"
            placeholder="Titre"
            required
        />
        <textarea
            v-model="task.description"
            placeholder="Description"
            required
        ></textarea>
        <button type="submit">{{ isEdit ? 'Mettre à jour' : 'Ajouter' }}</button>
      </form>


      <div class="task-list-container">
        <ul class="task-list">
          <li v-for="task in tasks" :key="task.id" class="task-item">
            <h3>{{ task.title }}</h3>
            <p>{{ task.description }}</p>
            <button @click="editTask(task)">Modifier</button>
            <button @click="deleteTask(task.id)">Supprimer</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import todoImage from './assets/todo.png';

export default {
  data() {
    return {
      todoImage,
      tasks: [],
      task: { title: "", description: "" },
      isEdit: false,
      editId: null,
    };
  },
  methods: {
    fetchTasks() {
      axios
          .get("http://localhost:5000/tasks")
          .then((response) => {
            this.tasks = response.data;
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des tâches :", error);
          });
    },
    addTask() {
      axios
          .post("http://localhost:5000/tasks", this.task)
          .then(() => {
            this.fetchTasks();
            this.resetForm();
          })
          .catch((error) => {
            console.error("Erreur lors de l'ajout de la tâche :", error);
          });
    },
    editTask(task) {
      this.task = { title: task.title, description: task.description };
      this.isEdit = true;
      this.editId = task.id;
    },
    updateTask() {
      axios
          .put(`http://localhost:5000/tasks/${this.editId}`, this.task)
          .then(() => {
            this.fetchTasks();
            this.resetForm();
          })
          .catch((error) => {
            console.error("Erreur lors de la mise à jour de la tâche :", error);
          });
    },
    deleteTask(id) {
      axios
          .delete(`http://localhost:5000/tasks/${id}`)
          .then(() => {
            this.fetchTasks();
          })
          .catch((error) => {
            console.error("Erreur lors de la suppression de la tâche :", error);
          });
    },
    resetForm() {
      this.task = { title: "", description: "" };
      this.isEdit = false;
      this.editId = null;
    },
  },
  mounted() {
    this.fetchTasks();
  },
};
</script>

<style>

.container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 20px;
  padding: 20px;
  background-color: #f4f4f9;
}


.image-container {
  flex: 1;
}

.image-container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


.task-manager {
  flex: 2;
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
}


h1 {
  text-align: center;
  color: #000000;
  font-size: 2rem;
  margin-bottom: 20px;
}


.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input,
textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
}


button[type="submit"] {
  font-size: 0.9rem;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #4caf50;
  color: #fff;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #388e3c;
}

.task-item button:first-of-type {
  font-size: 0.8rem;
  padding: 5px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 10px;
  background-color: #28a745;
  color: #fff;
  transition: background-color 0.3s ease;
}

.task-item button:first-of-type:hover {
  background-color: #28a745;
}


.task-item button:last-of-type {
  font-size: 0.8rem;
  padding: 5px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #e91e63;
  color: #fff;
  transition: background-color 0.3s ease;
}

.task-item button:last-of-type:hover {
  background-color: #d81b60;
}

.task-list-container {
  flex-grow: 1;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  margin-top: 20px;
}


.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}


.task-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 6px;
}

.task-item:hover {
  background-color: #f1f1f1;
}

.task-item h3 {
  font-size: 1rem;
  margin: 0;
  color: #007bff;
}

.task-item p {
  font-size: 0.9rem;
  margin: 5px 0;
  color: #555;
}

.task-item button {
  font-size: 0.8rem;
  padding: 5px 8px;
}


@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: center;
  }

  .image-container img {
    height: auto;
    width: 100%;
  }

  .task-manager {
    width: 100%;
  }
}
</style>
