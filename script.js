const menuToggle = document.querySelector('.menu-toggle');
const siteNavigation = document.querySelector('.site-navigation');

if (menuToggle && siteNavigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.classList.toggle('is-open');
    siteNavigation.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  siteNavigation.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      menuToggle.classList.remove('is-open');
      siteNavigation.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) {
      menuToggle.classList.remove('is-open');
      siteNavigation.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }
  });
}

const quizButtons = document.querySelectorAll('[data-quiz-answer]');
const quizFeedback = document.querySelector('[data-quiz-feedback]');

quizButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const correct = button.dataset.quizAnswer === 'correct';
    quizFeedback.textContent = correct
      ? 'Correct. Groceries can change from month to month, so they are usually a variable expense.'
      : 'Not quite. Rent and a fixed phone plan usually stay the same; groceries are variable.';
    quizFeedback.className = `feedback ${correct ? 'success' : 'error'}`;
  });
});

const classificationButtons = document.querySelectorAll('[data-classification]');
const classificationFeedback = document.querySelector('[data-classification-feedback]');

classificationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const correct = button.dataset.classification === 'need';
    classificationFeedback.textContent = correct
      ? 'Correct. Basic groceries support an essential need. Optional treats added to the trip would be wants.'
      : 'Try again. A weekly grocery shop is generally a need, although extra treats within the shop may be wants.';
    classificationFeedback.className = `feedback ${correct ? 'success' : 'error'}`;
  });
});

const savingsForm = document.querySelector('#savings-form');

if (savingsForm) {
  savingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const goalName = document.querySelector('#goal-name').value.trim();
    const target = Number(document.querySelector('#target-amount').value);
    const current = Number(document.querySelector('#current-savings').value);
    const monthly = Number(document.querySelector('#monthly-contribution').value);
    const error = document.querySelector('#savings-error');

    if (!goalName || [target, current, monthly].some((value) => !Number.isFinite(value)) || target <= 0 || current < 0 || monthly <= 0) {
      error.textContent = 'Enter a goal name, positive target and monthly contribution, with current savings at zero or more.';
      return;
    }

    if (current > target) {
      error.textContent = 'Current savings cannot be higher than the target amount.';
      return;
    }

    error.textContent = '';
    const remaining = target - current;
    const months = Math.ceil(remaining / monthly);
    const progress = Math.min((current / target) * 100, 100);
    document.querySelector('#savings-progress').style.width = `${progress}%`;
    document.querySelector('#savings-summary').textContent = remaining === 0
      ? `${goalName} is complete. You have reached $${target.toFixed(2)}.`
      : `${goalName}: $${remaining.toFixed(2)} remaining, approximately ${months} month${months === 1 ? '' : 's'} at $${monthly.toFixed(2)} per month.`;
  });
}

const expenseForm = document.querySelector('#expense-form');

if (expenseForm) {
  const expenses = [];
  const rows = document.querySelector('#expense-rows');
  const totalDisplay = document.querySelector('#expense-total');
  const remainingDisplay = document.querySelector('#expense-remaining');
  const error = document.querySelector('#expense-error');

  const renderExpenses = () => {
    rows.innerHTML = '';
    if (expenses.length === 0) {
      rows.innerHTML = '<tr class="empty-row"><td colspan="5">No expenses added yet.</td></tr>';
    }

    expenses.forEach((expense, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${expense.date}</td><td>${expense.category}</td><td>${expense.description}</td><td>$${expense.amount.toFixed(2)}</td><td><button class="row-action" type="button" data-edit-expense="${index}">Edit</button> <button class="row-action" type="button" data-remove-expense="${index}">Remove</button></td>`;
      rows.appendChild(row);
    });

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
    remainingDisplay.textContent = `$${Math.max(1200 - total, 0).toFixed(2)}`;
  };

  expenseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = Number(document.querySelector('#expense-amount').value);
    const description = document.querySelector('#expense-description').value.trim();
    const date = document.querySelector('#expense-date').value;
    if (!date || !description || !Number.isFinite(amount) || amount <= 0) {
      error.textContent = 'Add a date, description, and positive numeric amount.';
      return;
    }
    error.textContent = '';
    expenses.push({
      date,
      category: document.querySelector('#expense-category').value,
      description,
      amount,
    });
    expenseForm.reset();
    renderExpenses();
  });

  rows.addEventListener('click', (event) => {
    const editIndex = event.target.dataset.editExpense;
    const removeIndex = event.target.dataset.removeExpense;
    if (removeIndex !== undefined) {
      expenses.splice(Number(removeIndex), 1);
      renderExpenses();
    }
    if (editIndex !== undefined) {
      const expense = expenses[Number(editIndex)];
      const editedAmount = Number(window.prompt('Update the expense amount:', expense.amount));
      if (Number.isFinite(editedAmount) && editedAmount > 0) {
        expense.amount = editedAmount;
        renderExpenses();
      }
    }
  });
}
