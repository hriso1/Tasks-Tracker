import View from './View';

class SidebarView extends View {
  _toggleButton = document.getElementById('toggle-btn');
  _sidebar = document.getElementById('sidebar');
  _sidebarListContainer = document.querySelector('.list-pages');
  _chartsLink = document.getElementById('charts-page');
  _homeLink = document.getElementById('home-page');
  _main = document.querySelector('.main');
  _chartsMain = document.querySelector('.charts-main');

  ////////////////////////////////////////////////////// Adauga clasa active linkului apasat
  handlerSidebar() {
    this._sidebarListContainer.addEventListener('click', function (event) {
      // Finds the clicked li
      const clickedLi = event.target.closest('li');
      if (!clickedLi || clickedLi.classList.contains('active')) return;

      // Removes the active class from the current li
      const activeLi = document.querySelector('.list-pages li.active');
      if (activeLi) activeLi.classList.remove('active');

      // Add the active class to the clicked li
      clickedLi.classList.add('active');
    });
  }

  ///////////////////////////////////////////////////// Roteste iconita de la sidebar
  toggleSidebar() {
    this._toggleButton.addEventListener('click', () => {
      this._sidebar.classList.toggle('close');
      this._toggleButton.classList.toggle('rotate');
    });
  }

  showChartsPage() {
    this._chartsLink.addEventListener('click', () => {
      this._main.textContent = '';
    });
  }

  showHomeContent(handle) {
    this._homeLink.addEventListener('click', function () {
      handle();
    });
  }
  // allows the function to be used in directly in html document
}

export default new SidebarView();
