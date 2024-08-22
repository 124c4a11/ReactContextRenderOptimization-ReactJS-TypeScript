import {
  createContext,
  memo,
  PropsWithChildren,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";

interface Todo {
  id: number;
  title: string;
}

const TodoContext = createContext<{ todoes: Todo[] } | null>(null);
const TodoContextActions = createContext<{
  createTodo: (title: string) => void;
  deleteTodo: (id: number) => void;
} | null>(null);

let itemID = 0;

function TodoProvider({ children }: PropsWithChildren) {
  const [todoes, setTodoes] = useState<Todo[]>([]);

  function createTodo(title: string) {
    ++itemID;
    setTodoes((prev) => [...prev, { id: itemID, title }]);
  }

  function deleteTodo(todoID: number) {
    setTodoes((prev) => prev.filter(({ id }) => id !== todoID));
  }

  const value = useMemo(() => ({ todoes }), [todoes]);
  const actions = useMemo(() => ({ createTodo, deleteTodo }), []);

  return (
    <TodoContext.Provider value={value}>
      <TodoContextActions.Provider value={actions}>
        {children}
      </TodoContextActions.Provider>
    </TodoContext.Provider>
  );
}

function useTodo() {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error("useTodo must be used within with a TodoProvider");
  }

  return context;
}

function useTodoActions() {
  const context = useContext(TodoContextActions);

  if (!context) {
    throw new Error("useTodoActions must be used within with a TodoProvider");
  }

  return context;
}

function CreateTodoForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { createTodo } = useTodoActions();

  console.log("form");

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={() => createTodo(inputRef.current?.value ?? "")}>
        create todo
      </button>
    </>
  );
}

function List() {
  const { todoes } = useTodo();

  console.log("list");

  return (
    <>
      {!!todoes.length && (
        <ul>
          {todoes.map((item) => (
            <ListItem key={item.id} {...item} />
          ))}
        </ul>
      )}
    </>
  );
}

const ListItem = memo(function ListItem({ id, title }: Todo) {
  const { deleteTodo } = useTodoActions();

  console.log("item");

  return (
    <li>
      {id}: {title} <button onClick={() => deleteTodo(id)}>delete</button>
    </li>
  );
});

function App() {
  return (
    <TodoProvider>
      <CreateTodoForm />
      <List />
    </TodoProvider>
  );
}

export default App;
