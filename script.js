const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#search');
const resultsList = document.querySelector('#results');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchRecipes();
});

async function searchRecipes() {
    const searchValue = searchInput.value.trim();
    if (!searchValue) return;

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`);

    if (!response.ok) {
        resultsList.innerHTML = `<p>Error fetching data. Please try again.</p>`;
        return;
    }

    const data = await response.json();
    displayRecipes(data.meals);
}

function displayRecipes(meals) {
    if (!meals) {
        resultsList.innerHTML = `<p>No recipes found. Try another search term.</p>`;
        return;
    }

    let html = '';

    meals.forEach((meal) => {
        html += `
        <div>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
            <ul>
                ${getIngredients(meal).map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <a href="${meal.strSource || 'https://www.themealdb.com/meal.php?c=' + meal.idMeal}" target="_blank">View Recipe</a>
        </div>
        `;
    });

    resultsList.innerHTML = html;
}

function getIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${ingredient} - ${measure}`);
        }
    }
    return ingredients;
}
