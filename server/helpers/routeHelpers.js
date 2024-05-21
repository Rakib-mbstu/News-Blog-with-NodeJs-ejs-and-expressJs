function isActiveRoute(route, currentRoute) {
  return route === currentRoute ? "active" : "inactive";
}

module.exports={isActiveRoute}