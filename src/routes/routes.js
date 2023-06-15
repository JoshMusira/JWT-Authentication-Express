// import { getTodos, getTodo, createTodo, updateTodo, deleteTodo } from '../controllers/todocontroller.js';
// import { register, login } from '../controllers/userController.js';

// const todoRoutes = (app) => {
//     app.route('/todos')
//         .get(getTodos)
//         .post(createTodo);

//     app.route('/todo/:id')
//         .put(updateTodo)
//         .get(getTodo)
//         .delete(deleteTodo);

//      app.route('/auth/register')
//         .post(register);
        
//     app.route('/auth/login')
//         .post(login);
// }


// export default todoRoutes;


import { getTodos, getTodo, createTodo, updateTodo, deleteTodo } from '../controllers/todocontroller.js';
import { login, register, loginRequired } from '../controllers/userController.js';

const routes = (app) => {
    //todo routes
    app.route('/todos')
        .get(loginRequired, getTodos)
        .post(loginRequired, createTodo);

    app.route('/todo/:id')
        .put(loginRequired, updateTodo)
        .get(loginRequired, getTodo)
        .delete(loginRequired, deleteTodo);

    // auth routes
    app.route('/auth/register')
        .post(register);

    app.route('/auth/login')
        .post(login);


};
export default routes;