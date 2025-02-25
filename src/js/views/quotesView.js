import View from './View.js';
import { motivationQuotes } from '../helpers.js';
/*
    fa o functie care sa aleaga aleatorie un item din motivational object
    _generateMarkrup si folosesti functia ca sa aleaga un numar aleatoriu

*/

class QuotesView extends View {
  _parentElement = document.querySelector('.motivationalQuotes-container');

  _generateRandom() {
    const randomNumber = Math.floor(Math.random() * motivationQuotes.length);
    return motivationQuotes[randomNumber];
  }

  _generateMarkup() {
    return `
        <div class="quote" >
            ${this._generateRandom().quote}
              <div class="author" >
           - ${this._generateRandom().author}
                </div>
        </div>
      
    `;
  }
}

export default new QuotesView();
