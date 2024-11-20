"use strict";

const logoutButton = new LogoutButton();
const moneyManager = new MoneyManager();
const ratesBoard = new RatesBoard();
const favoritesWidget = new FavoritesWidget();

logoutButton.action = () => {
  ApiConnector.logout((response) =>
    response.success
      ? location.reload()
      : moneyManager.setMessage(response.success, response.error)
  );
};

ApiConnector.current((response) =>
  response.success
    ? ProfileWidget.showProfile(response.data)
    : moneyManager.setMessage(response.success, response.error)
);

function getCours() {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
}
getCours();
setInterval(() => getCours(), 60000);

moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "Ваш баланс пополнен!");
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};

moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(
        response.success,
        "Конвертация суммы прошла успешно!"
      );
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};

moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(
        response.success,
        "Перевод суммы выполнен успешно!"
      );
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};

ApiConnector.getFavorites((response) => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  } else {
    favoritesWidget.setMessage(response.error);
  }
});

favoritesWidget.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, "Пользователь добавлен!");
    } else {
      favoritesWidget.setMessage(response.success, response.error);
    }
  });
};

favoritesWidget.removeUserCallback = (data) => {
  ApiConnector.removeUserFromFavorites(data, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, "Пользователь удален!");
    } else {
      favoritesWidget.setMessage(response.success, response.error);
    }
  });
};
