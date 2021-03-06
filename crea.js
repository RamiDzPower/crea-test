"use strict";
// Please read the README file to understand the pourpose and limitations of thie code
Object.defineProperty(exports, "__esModule", { value: true });
// DEFAULT CONSTANTS TO RESTRICT THE POTENTIAL GENERATION OF INFINITE SET OF ROUTES
// According to the definitions, the set of routes include routes with loops such as: CEBCEBCEBC
exports.NOROUTE = "NO SUCH ROUTE";
var DEFAULT_MAXIMUN_ROUTE_LENGTH = 11;
var DEFAULT_MAXIMUN_ROUTE_DISTANCE = 30;
var Link = /** @class */ (function () {
    function Link(slink) {
        this.slink = slink;
    }
    Object.defineProperty(Link.prototype, "destination", {
        get: function () {
            return this.slink[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "start", {
        get: function () {
            return this.slink[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "distance", {
        get: function () {
            return parseInt(this.slink[2]);
        },
        enumerable: true,
        configurable: true
    });
    return Link;
}());
var GraphNode = /** @class */ (function () {
    function GraphNode() {
    }
    return GraphNode;
}());
var Graph = /** @class */ (function () {
    function Graph() {
    }
    return Graph;
}());
// crea Class does everything
// It contains a graph and various functions to calculate rountes and also input and output data.
var crea = /** @class */ (function () {
    function crea() {
        this.graph = new Graph(); //This is the graphs of towns and routes
    }
    // FUNCTIONS USED TO LOAD THE INITIAL GRAPH FROM EXTERNAL DATA
    crea.prototype.addLink = function (link) {
        // Adds a link to the Graph
        if (!this.graph[link.start]) {
            this.graph[link.start] = new GraphNode();
            this.graph[link.start] = {};
        }
        this.graph[link.start][link.destination] = link.distance;
    };
    crea.prototype.loadGraphLinks = function (slinks) {
        var _this = this;
        // Loads all the provided input strings such as "AB5"..etc
        slinks.forEach(function (sl) {
            _this.addLink(new Link(sl));
        });
    };
    // THE FOLLOWING THE FUNCTIONS ARE THE MOST IMPORTANT
    // AND ARE USED TO CALCULATE THE SET OF ALL ROUTES ACCORDING TO PARAMETERS
    crea.prototype.allRoutes = function (start, destination) {
        // All posible routes up to a certain maximun distance that we can find from Start to Destination
        // Note: According to the definitions, The set of routes include routes with loops such as: CEBCEBCEBC
        return this.allRoutesRecursive([start], 0, destination);
    };
    crea.prototype.allRoutesRecursive = function (
    /*
    This method recursively calculates all routes up to a specified maximum number of stop (length)
    and uses de 'depth-first' approach
    Conceptually, to solve the problem of calculating all the routes from A to B
    up to a specified maximum length 'n', we assume we know how to solve the problem for n-1 and the base case n=0.
    So, start from the starting town and create the first routes based on the available direct links.
    Then recursively we calculate the routes that start from the last town in the route.
    The routes in this new subset are smaller than n.
    Controlling the recursion is the reason why we keep passing the current route.
    That current route keeps growing in each call getting closer to "n"
    An optimized, a more scalable version may want to refactor the recursion with a sequential loop.
    Note: We also use the maximum distance to stop the recursion
    due to requirements ask both about sets of routes up to some "stops" and also up to a distance.
    */
    route, // current route to start calculating the set
    routeLength, destination, // This is always the same destination town being passed
    maxDistance, maxLength) {
        if (maxDistance === void 0) { maxDistance = DEFAULT_MAXIMUN_ROUTE_DISTANCE; }
        if (maxLength === void 0) { maxLength = DEFAULT_MAXIMUN_ROUTE_LENGTH; }
        // The start of every route is the very original start
        // The end of the route is where the route generations needs to start
        var currentTown = route[route.length - 1];
        var reachableTowns = this.graph[currentTown];
        var routes = []; // This is the total set of routes that is going to be returned
        // Notice later that  if maxDistance or MaxLength were reached thi function will return the empty seet.
        // Here we go link by link creating new routes longer.
        for (var town in reachableTowns) {
            var lroute = route.concat([town]); // This is one of the new routes.
            var lrouteDistance = routeLength + this.linkDistance(currentTown, town);
            if (lrouteDistance <= maxDistance && // that have distance equal or less than maxDistance
                lroute.length <= maxLength // and lenght equal or less than maxLength
            ) {
                if (town === destination // we only collect routes that end in the destination
                ) {
                    routes.push(lroute);
                }
                //Now, we recursivelly calculate all the routes starting from the new, longer, route
                var lroutes = this.allRoutesRecursive(lroute, // This route is one stop longer that the input route.
                lrouteDistance, destination, maxDistance, maxLength);
                //And finally we add all those new routes into our set
                routes = routes.concat(lroutes);
            }
        }
        return routes; //we return the set of all routes starting from the received route.
    };
    // GETTER FUNCTIONS TO PRODUCE THE DESIRED RESULTS
    // ALL THESE FUNCTION DO NOT ALTER THE STATE OF THE GRAPH
    crea.prototype.linkDistance = function (A, B) {
        // Here we jsut get the distance between A and B by finding the value stored in the Maps
        return this.graph[A][B] || exports.NOROUTE;
    };
    crea.prototype.routeDistance = function (route) {
        var _this = this;
        // the route distace is just the sum of the distances of all links between towns
        return route.reduce(function (acc, townName, i) {
            if (i === 0)
                return 0;
            var distance = _this.linkDistance(route[i - 1], townName);
            return distance === exports.NOROUTE ? exports.NOROUTE : acc + distance;
        }, 0);
    };
    crea.prototype.allRoutesForAMaximunNumberOfStops = function (
    // thiwsfunction just filters the set to the ones up to a  provided number of steps
    start, destination, numberOfStops) {
        return this.allRoutesRecursive([start], 0, destination, DEFAULT_MAXIMUN_ROUTE_DISTANCE, numberOfStops + 1);
    };
    crea.prototype.allRoutesForANumberOfStops = function (
    // this function just filters the set to the ones with the exact provided number of steps
    start, destination, numberOfStops) {
        return this.allRoutesForAMaximunNumberOfStops(start, destination, numberOfStops).filter(function (route) { return route.length === numberOfStops + 1; });
    };
    crea.prototype.allOfRoutesMaximunDistance = function (
    // this function does the filter using the internal accepted mas distance
    start, destination, maxDistance) {
        return this.allRoutesRecursive([start], 0, destination, maxDistance);
    };
    crea.prototype.shortestDistance = function (start, destination) {
        var _this = this;
        return this.allRoutesRecursive([start], 0, destination).reduce(function (acc, route) {
            var distance = _this.routeDistance(route);
            if (acc === exports.NOROUTE) {
                return distance;
            }
            else {
                return distance < acc ? distance : acc;
            }
        }, exports.NOROUTE);
    };
    return crea;
}());
exports.crea = crea;
//# sourceMappingURL=crea.js.map