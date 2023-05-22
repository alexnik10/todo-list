function createElement(tag, attributes, children, eventListeners) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  if (eventListeners) {
    Object.keys(eventListeners).forEach((event) => {
      const listeners = eventListeners[event];
      if (Array.isArray(listeners)) {
        listeners.forEach((listener) => {
          element.addEventListener(event, listener);
        });
      } else {
        element.addEventListener(event, listeners);
      }
    });
  }

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this._state = {
      tasks: [
        { id: 1, label: "Сделать домашку" },
        { id: 2, label: "Сделать практику" },
        { id: 3, label: "Пойти домой" }
      ],
      newTaskValue: ''
    };
  }

  onAddTask = () => {
    const { newTaskValue, tasks } = this._state;
    if (newTaskValue !== '') {
      const newTask = {
        id: tasks.length + 1,
        label: newTaskValue
      };
      tasks.push(newTask);
      this._state.newTaskValue = '';
      this.updateDomNode();
    }
  };

  onAddInputChange = (event) => {
    const newTaskValue = event.target.value;
    this._state.newTaskValue = newTaskValue;
  };

  render() {
    const { tasks, newTaskValue } = this._state;

    const taskElements = tasks.map(task => {
      return createElement("li", {}, [
        createElement("input", { type: "checkbox" }),
        createElement("label", {}, task.label),
        createElement("button", {}, "🗑️")
      ]);
    });

    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      createElement("div", { class: "add-todo" }, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
          value: newTaskValue,
          oninput: this.onAddInputChange
        }),
        createElement("button", { id: "add-btn", onclick: this.onAddTask }, "+"),
      ]),
      createElement("ul", { id: "todos" }, taskElements),
    ]);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
