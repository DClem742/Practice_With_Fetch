document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  const form = document.createElement('form');
  form.className = 'field has-addons';

  const inputControl = document.createElement('div');
  inputControl.className = 'control is-expanded';
  const input = document.createElement('input');
  input.className = 'input';
  input.type = 'text';
  input.id = 'username';
  input.placeholder = 'Enter GitHub username';
  inputControl.appendChild(input);

  const buttonControl = document.createElement('div');
  buttonControl.className = 'control';
  const button = document.createElement('button');
  button.className = 'button is-primary';
  button.textContent = 'Search';
  buttonControl.appendChild(button);

  form.appendChild(inputControl);
  form.appendChild(buttonControl);

  const resultDiv = document.createElement('div');
  resultDiv.id = 'result';
  resultDiv.className = 'mt-4';

  const issuesButton = document.createElement('button');
  issuesButton.className = 'button is-info mb-4';
  issuesButton.textContent = 'Fetch create-react-app Issues';

  const issuesContainer = document.createElement('div');
  issuesContainer.id = 'issues-container';

  const issueInput = document.createElement('input');
  issueInput.className = 'input mb-2';
  issueInput.type = 'text';
  issueInput.placeholder = 'Enter issue number';

  const fetchButton = document.createElement('button');
  fetchButton.className = 'button is-primary mb-4';
  fetchButton.textContent = 'Fetch Specific Issue';

  const issueContainer = document.createElement('div');
  issueContainer.id = 'issue-container';

  app.appendChild(form);
  app.appendChild(resultDiv);
  app.appendChild(issuesButton);
  app.appendChild(issuesContainer);
  app.appendChild(issueInput);
  app.appendChild(fetchButton);
  app.appendChild(issueContainer);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = input.value.trim();
    if (username) {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
          throw new Error('User not found');
        }
        const userData = await response.json();
        appendUserInfo(userData);
      } catch (error) {
        showError(error.message);
      }
    }
    form.reset();
  });

  issuesButton.addEventListener('click', fetchIssues);
  fetchButton.addEventListener('click', fetchSpecificIssue);

  function appendUserInfo(user) {
    const userBox = document.createElement('div');
    userBox.className = 'box mb-4';
    userBox.innerHTML = `
      <article class="media">
        <div class="media-left">
          <figure class="image is-64x64">
            <img src="${user.avatar_url}" alt="${user.login}">
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <h2 class="title is-4">${user.name || user.login}</h2>
            <p class="subtitle is-6">@${user.login}</p>
            <p>${user.bio || 'No bio available'}</p>
            <div class="tags">
              <span class="tag is-info">Followers: ${user.followers}</span>
              <span class="tag is-success">Following: ${user.following}</span>
              <span class="tag is-warning">Public Repos: ${user.public_repos}</span>
            </div>
            <p><strong>Location:</strong> ${user.location || 'Not specified'}</p>
          </div>
        </div>
      </article>
    `;
    resultDiv.appendChild(userBox);
  }

  function showError(message) {
    const errorBox = document.createElement('div');
    errorBox.className = 'notification is-danger mb-4';
    errorBox.textContent = message;
    resultDiv.appendChild(errorBox);
  }

  async function fetchIssues() {
    try {
      const response = await fetch('https://api.github.com/repos/facebook/create-react-app/issues');
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }
      const issues = await response.json();
      displayIssues(issues);
    } catch (error) {
      showError(error.message);
    }
  }

  function displayIssues(issues) {
    issuesContainer.innerHTML = '';
    issues.forEach(issue => {
      const issueElement = document.createElement('div');
      issueElement.className = 'box mb-4';
      issueElement.innerHTML = `
        <h3 class="title is-5">${issue.title}</h3>
        <div class="content">${issue.body}</div>
      `;
      issuesContainer.appendChild(issueElement);
    });
  }

  async function fetchSpecificIssue() {
    const issueNumber = issueInput.value.trim();
    if (!issueNumber) {
      showError('Please enter an issue number');
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/repos/facebook/create-react-app/issues/${issueNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch issue');
      }
      const issue = await response.json();
      displayIssue(issue);
    } catch (error) {
      showError(error.message);
    }
  }

  function displayIssue(issue) {
    issueContainer.innerHTML = '';
    const issueElement = document.createElement('div');
    issueElement.className = 'box';
    issueElement.innerHTML = `
      <h2 class="title is-4">${issue.title}</h2>
      <div class="content">${issue.body}</div>
    `;
    issueContainer.appendChild(issueElement);
  }
});
