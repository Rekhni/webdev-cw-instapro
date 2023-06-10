import { loginUser, registerUser } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { validate, checkLogin} from "../helpers.js";

export function renderAuthPageComponent({ appEl, setUser }) {
  let isLoginMode = true;
  let imageUrl = "";

  const renderForm = () => {
    const appHtml = `
      <div class="page-container">
          <div class="header-container"></div>
          <div class="form">
              <h3 class="form-title">
                ${
                  isLoginMode
                    ? "Sign in on&nbsp;Instapro"
                    : "Sign up on&nbsp;Instapro"
                }
                </h3>
              <div class="form-inputs">
    
                  ${
                    !isLoginMode
                      ? `
                      <div class="upload-image-container"></div>
                      <input type="text" id="name-input" class="input" placeholder="Name" />
                      `
                      : ""
                  }
                  
                  <input type="text" id="login-input" class="input" placeholder="Login" />
                  <input type="password" id="password-input" class="input" placeholder="Password" />
                  
                  <div class="form-error"></div>
                  
                  <button class="button" id="login-button">${
                    isLoginMode ? "Sign in" : "Sign up"
                  }</button>
              </div>
            
              <div class="form-footer">
                <p class="form-footer-title">
                  ${isLoginMode ? "No account?" : "Already have account?"}
                  <button class="link-button" id="toggle-button">
                    ${isLoginMode ? "Sign up." : "Sign in."}
                  </button>
                </p> 
               
              </div>
          </div>
      </div>    
`;

    appEl.innerHTML = appHtml;

    // Не вызываем перерендер, чтобы не сбрасывалась заполненная форма
    // Точечно обновляем кусочек дом дерева
    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("login-button").addEventListener("click", () => {
      setError("");

      if (isLoginMode) {
        const loginInput = document.getElementById("login-input");
        const login = document.getElementById("login-input").value;
        const passwordInput = document.getElementById("password-input");
        const password = document.getElementById("password-input").value;

        if (!validate(loginInput, 'Login')) return;

        if (!validate(passwordInput, 'Password')) return;


        loginUser({
          login: login,
          password: password,
        })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });

      } else {
        const login = document.getElementById("login-input").value;
        const loginInput = document.getElementById("login-input");
        const name = document.getElementById("name-input").value;
        const nameInput = document.getElementById("name-input");
        const password = document.getElementById("password-input").value;
        const passwordInput = document.getElementById("password-input");

        if (!validate(nameInput, 'Name')) return;
        if (!checkLogin(nameInput, 'Password')) return;
        if (!validate(loginInput, 'Login')) return;
        if (!checkLogin(loginInput, 'Login')) return;
        if (!validate(passwordInput, 'Password')) return;



        if (!imageUrl) {
          alert("Image wasn't picked");
          return;
        }

        registerUser({
          login: login,
          password: password,
          name: name,
          imageUrl,
        })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      }
    });

    document.getElementById("toggle-button").addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      renderForm();
    });
  };

  renderForm();
}
