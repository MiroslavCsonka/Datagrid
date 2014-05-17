var appModuleName = 'cp';
var app = angular.module(appModuleName, []);

app.service('GroupingFunctions', function () {
    return {
        sum: function (previousValue, currentValue, index, array) {
            return previousValue + currentValue;
        },
        count: function (previousValue, currentValue, index, array) {
            return previousValue + 1;
        },
        concatenate: function (previousValue, currentValue, index, array) {
            return previousValue + ", " + currentValue;
        }
    };
});

app.directive('cpDatagrid', function (GroupingFunctions) {
    var defaultConfig = {
        itemsPerPage: 10
    };
    var controller = function ($scope) {
        //console.log($scope);

        $scope.rows = $scope.data;
        $scope.rawRows = $scope.rows;
        $scope.config = angular.extend({}, defaultConfig, $scope.config);


        // ----------------------- ORDERING -----------------------
        $scope.order = {
            column: 'id',
            reversed: false,
            setOrderingColumn: function (column) {
                $scope.order.reversed = (column == $scope.order.column)
                    ? !$scope.order.reversed
                    : false;
                $scope.order.column = column;
            }
        };

        // ----------------------- PAGINATION -----------------------
        $scope.currentPage = 0;
        $scope.numberOfPages = function () {
            return Math.ceil($scope.rows.length / $scope.config.itemsPerPage);
        };

        // ----------------------- GROUPING -----------------------
        $scope.grouping = {
            groups: [],
            addGroup: function (columnId) {
                var index = $scope.grouping.groups.indexOf(columnId);
                if (index === -1) {
                    if ($scope.grouping.groups.length < 1) {
                        $scope.grouping.groups.push(columnId);
                    } else {
                        alert('Zatím jde slučovat záznamy pouze do jedné úrovně');
                    }
                }
            },
            removeGroup: function (columnId) {
                var index = $scope.grouping.groups.indexOf(columnId);
                $scope.grouping.groups.splice(index, 1)

            },
            showToolbar: function () {
                return $scope.grouping.groups.length > 0;
            }
        };

        var combineRows = function (rows, doNotCombineColumnId) {
            var result = {};
            angular.forEach($scope.config.columns, function (configForColumn, key) {
                if (key !== doNotCombineColumnId && (GroupingFunctions[configForColumn.grouping] !== undefined)) {
                    var values = rows.map(function (row) {
                        return row[key];
                    });
                    result[key] = values.reduce(GroupingFunctions[configForColumn.grouping]);
                } else {
                    result[key] = rows[0][key];
                }
            });
            return result;
        };

        /**
         * Splits array into smaller chunks by values of propertyOfObject
         * @param arrayOfObjects
         * @param propertyOfObject
         * @returns {}
         */
        var groupBy = function (arrayOfObjects, propertyOfObject) {
            var camps = {};
            angular.forEach(arrayOfObjects, function (row) {
                var value = row[propertyOfObject];
                if (camps[value] === undefined) {
                    camps[value] = []
                }
                camps[value].push(row);
            });
            return camps;
        };

        $scope.$watch("grouping.groups.length", function () {
            if ($scope.grouping.groups.length == 0) {
                $scope.rows = $scope.rawRows
            } else {
                var columnIdToGroupBy = $scope.grouping.groups[0];
                var camps = groupBy($scope.rawRows, columnIdToGroupBy);
                var groupedRows = [];
                angular.forEach(camps, function (camp) {
                    var newRow = combineRows(camp, columnIdToGroupBy);
                    newRow._nested = camp;
                    newRow._isOpen = false;
                    groupedRows.push(newRow);
                });
                $scope.rows = groupedRows;
            }
        });
    };

    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'app/datagrid.html',
        scope: {
           data: '=',
           config: '='
        },
        controller: controller
    };
});

app.filter('deGroup', function () {
    return function (input) {
        var output = [];
        angular.forEach(input, function (row) {
            output.push(row);
            if (row._isOpen === true) {
                output = output.concat(row._nested);
            }
        });
        return output;
    };
});

app.filter('startFrom', function () {
    return function (input, start) {
        return input.slice(parseInt(start));
    }
});

angular.element(document).ready(function () {
    angular.bootstrap(document, [appModuleName]);
});
