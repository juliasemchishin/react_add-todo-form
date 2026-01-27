import './App.scss';

import usersFromServer, { User } from './api/users';
import todosFromServer, { Todo } from './api/todos';
import React, { useState } from 'react';
import { UserInfo } from './components/UserInfo';
import { TodoList } from './components/TodoList';

// export interface Todos extends Todo {
//   id: number;
//   title: string;
//   completed: boolean;
//   userId: number;
//   user: User | undefined;
// }

export type TodoWithUser = Todo & { user?: User };

function getUserById(userId: number) {
  return usersFromServer.find(user => user.id === userId);
}

export const todos: TodoWithUser[] = todosFromServer.map(todo => ({
  ...todo,
  user: getUserById(todo.userId),
}));

export const App = () => {
  const [title, setTitle] = useState('');
  const [isTitleError, setIsTitleError] = useState(false);

  const [userId, setUserId] = useState(0);
  const [isUserIdError, setIsUserIdError] = useState(false);

  const [todosState, setTodosState] = useState<TodoWithUser[]>(todos);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isTitleErrorBoolean = !title;
    const isUserErrorBoolean = !userId;

    setIsTitleError(isTitleErrorBoolean);
    setIsUserIdError(isUserErrorBoolean);

    if (isTitleErrorBoolean || isUserErrorBoolean) {
      return;
    }

    const newTodo: TodoWithUser = {
      id: Math.max(...todosState.map(t => t.id)) + 1,
      title,
      completed: false,
      userId,
      user: getUserById(userId),
    };

    setTodosState(prev => [...prev, newTodo]);
    setTitle('');
    setUserId(0);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            data-cy="titleInput"
            placeholder="Enter a title"
            value={title}
            onChange={event => {
              setTitle(event.target.value);
              setIsTitleError(!event.target.value);
            }}
            onBlur={event => setIsTitleError(!event.target.value)}
          />
          {isTitleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <label htmlFor="userSelect">User: </label>
          <select
            data-cy="userSelect"
            value={userId}
            onChange={event => {
              setUserId(+event.target.value);
              setIsUserIdError(!event.target.value);
            }}
            onBlur={event => setIsUserIdError(!event.target.value)}
          >
            <option value="0" disabled>
              Choose a user
            </option>
            <UserInfo user={usersFromServer} />
          </select>

          {isUserIdError && <span className="error">Please choose a user</span>}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <section className="TodoList">
        <TodoList todos={todosState} />
      </section>
    </div>
  );
};
