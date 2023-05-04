import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user, getToken } from "../index.js";
import { responseHandler,fetchLike, deletePost } from '../api.js';
import { correctUsersString } from "../helpers.js";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale/';
import { POSTS_PAGE } from "../routes.js";



export function renderPostsPageComponent({ appEl, isUser, token}) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);
  console.log(isUser);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
              <div class="page-container center">
                <div class="header-container"></div>` 
                +
                `${isUser ? `<div class="posts-user-header"><img src="${posts[0].user.imageUrl}"
                 class="posts-user-header__user-image">
                 <class="posts-user-header__user-name">${posts[0].user.name}</p>
                 </div>` : ''}`
                 +

                `<ul class="posts">` +

                posts.reduce((result, post, index) => {
                  return result + 
                  
                  `<li class="post" data-id = "${post.id}" data-index = "${index}">
                  
                  ${isUser ? '' : `<div class="post-header" data-user-id=${post.user.id}>
                  <img src="${post.user.imageUrl}" class="post-header__user-image">
                  <p class="post-header__user-name">${[post.user.name]}</p>
                  </div>`}
                  
                  <div class="post-image-container">
                  <img class="post-image" src=${post.imageUrl}>
                  </div>

                  <div class="post-likes">
                    <button data-post-id=${post.id} class="like-button">
                      <img src="./assets/images/${post.isLiked ? 'like-active.svg' : 'like-not-active.svg'}">
                    </button>

                    <p class="post-likes-text">
                      Нравится: <strong>
                      ${post.likes.length > 1 ? post.likes[0].name + `и еще ${correctUsersString(post.likes.length - 1)}`
                      : post.likes.length ? post.likes[0].name
                      : "0"}</strong>
                    </p>
                  </div>
                  
                  <p class="post-text">
                    <span class="user-name">${post.user.name}</span>
                    ${post.description}
                  </p>
                  </br>
                  <button data-id="${post.id}"class="delete-button">Delete</button>
                  

                  <p class="post-date">
                    ${formatDistanceToNow(new Date(post.createdAt), {locale: ru, addSuffix: true})}
                  </p>
                  </br>
                  
                  </li>
                  `
                }, '') + 

                  `</ul>
                </div>`;
                  
              

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }



  for (let deleteButton of document.querySelectorAll('.delete-button')) {
    deleteButton.addEventListener("click", () => {
      if (!user) {
        alert('удалать посты могут только авторизованные пользователи')
          return;
        }
      const postId = deleteButton.dataset.postId
      console.log(postId)
  
      deletePost({
        token : getToken(),
        id : deleteButton.dataset.postId,
      }).then(() => {
        goToPage(POSTS_PAGE);
    })
    });
  }


  for (let button of document.querySelectorAll(".like-button")) {
    button.addEventListener("click", () => {
      const postId = button.dataset.postId;
      const index = button.closest('.post').dataset.index;
      const currentButton = button;
      let isLiked = '';
      posts[index].isLiked ? isLiked = 1 : isLiked = 0;
      if (user) {
        currentButton.classList.add('like-animation');
        fetchLike({ token, postId, isLiked })
        .then(() => {
          if (isLiked) {
            posts[index].isLiked = false;
            posts[index].likes.pop();
          } else {
            posts[index].isLiked = true;
            posts[index].likes.push({
              id: user._id,
              name: user.name
            });
          }

          renderPostsPageComponent({ appEl, isUser, token })
        })
      };
    });
  }
}

// function deletePost(index, token) {
//   return fetch('https://webdev-hw-api.vercel.app/api/v1/Reha/instapro/' + posts[index].id, {
//       method: "DELETE",
//       headers: {
//           authorization: token,
//       },
//   })
//       .then((response) => {        
//           if(response.status === 200){
//               posts.splice(index, 1);
//               renderPostsPageComponent({ appEl, isUser, token })
//               // return response.json();
//           }
//       })
//       .catch(error => {
//           console.warn(error);
//           if (error.message = 'Failed to fetch'){
//               alert('No internet link')
//           }
//       })
  
// };

