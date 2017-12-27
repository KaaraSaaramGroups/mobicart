var app = angular.module('KaviyaMobiles', ['ngAnimate', 'ngRoute', 'AngularPrint', 'ngCookies', 'toaster']);

app.run(function($rootScope, $location, $cookieStore) {
    $rootScope.user = $cookieStore.get('user');
    if ($rootScope.user) {
        if ($rootScope.user.uid) {
            $rootScope.isUser = true;
            if ($rootScope.user.rid == 1)
                $rootScope.isAdmin = true;
        } else {
            $rootScope.isUser = false;
            $rootScope.isAdmin = false;
        }
    } else {
        $location.path('/');
    }

    $rootScope.currYear = new Date().getFullYear();
    var d = new Date();
    var ampm = '';
    var rhr = ('0' + d.getHours()).slice(-2);
    var min = ('0' + d.getMinutes()).slice(-2);
    if (rhr >= 12) {
        ampm = 'PM';
        rhr = Math.abs(rhr - 12);
    } else {
        ampm = 'AM';
        rhr = rhr;
    }
    $rootScope.currDateTime = ('0' + d.getDate()).slice(-2) + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear() + " " + rhr + ":" + min + " " + ampm;
    $rootScope.ystrDate = ('0' + (d.getDate() - 1)).slice(-2) + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear();
});

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/view/signin-page.html',
            controller: 'SigninPageCntlr'
        })
        .when('/dashboard', {
            templateUrl: '/view/admin-dashboard.html',
            controller: 'AdminDashboardCntlr'
        })
        .when('/salesinvoice', {
            templateUrl: '/view/sales-invoice.html',
            controller: 'SalesInvoiceCntlr'
        })
        .when('/productbarcode', {
            templateUrl: '/view/product-bar-qr-code.html',
            controller: 'ProductBarCodeCntlr'
        })
        .when('/purchaseinvoice', {
            templateUrl: '/view/purchase-invoice.html',
            controller: 'PurchaseInvoiceCntlr'
        })
        .when('/productsearch', {
            templateUrl: '/view/product-search.html',
            controller: 'ProductSearchCntlr'
        })
        .when('/notifications', {
            templateUrl: '/view/notifications.html',
            controller: 'NotificationsCntlr'
        })
        .when('/transcations', {
            templateUrl: '/view/transcations.html',
            controller: 'TranscationsCntlr'
        })
        .when('/addcustomer', {
            templateUrl: '/view/add-customer.html',
            controller: 'AddCustomerCntlr'
        })
        .when('/logout', {
            templateUrl: '/view/signin-page.html',
            controller: 'LogoutCntlr'
        });
});

app.directive('bindUnsafeHtml', [function() {
        return {
            template: "<span style='color:orange'>Orange directive text!</span>"
        };
    }])
    // The directive that will be dynamically rendered
    .directive('bindName', [function() {
        return {
            template: "<span style='color:orange'>Hi {{directiveData.name}}!</span>"
        };
    }]);

app.controller('SigninPageCntlr', function($rootScope, $scope, $route, $routeParams, $http, $location, $cookieStore, toaster) {

        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;


        $scope.loginValidate = function() {
            var data = { name: $scope.lUserName, pass: $scope.lPassword };
            $http.post('/skm/login/', data).then(function(response) {
                var output = response.data;
                if (output.length) {
                    var user = output[0];
                    // Put cookie
                    $cookieStore.put('user', user);
                    $rootScope.user = user;
                    if (user.rid == 1) {
                        $rootScope.isAdmin = true;
                        $location.path('/dashboard');
                    } else {
                        $rootScope.isUser = true;
                        $location.path('/addcustomer');
                    }
                } else {
                    $rootScope.isAdmin = false;
                    $rootScope.isUser = false;
                    toaster.pop('error', "error", "Invalid crdentials");

                    $location.path('/');
                }
            }, function(response) {});

        };
    })
    .controller('AdminDashboardCntlr', function($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            // Javascript method's body can be found in assets/js/demos.js
            demo.initDashboardPageCharts();
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });

    })
    .controller('SalesInvoiceCntlr', function($scope, $http, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$http = $http;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
        var bno = Math.floor((Math.random() * 1000) + 1);
        $scope.billNo = 'BNO-' + bno;
        var d = new Date();
        $scope.issueDate = ('0' + d.getDate()).slice(-2) + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear();
        $scope.custTitle = '';
        $scope.custMessage = '';
        $scope.isSearchCust = false;
        $scope.isAdd = false;
        $scope.isValueLoad = false;
        $scope.isAddProduct = false;
        $scope.customerName = '';
        $scope.isTotDis = false;
        $scope.isDueAmnt = false;
        $scope.salesProductList = {
            "cusDetails": [{
                "name": null,
                "phone": null,
                "email": null,
                "street": null,
                "city": null,
                "state": null,
                "postalCode": null
            }],
            "pBillNo": null,
            "pList": [{
                "SNo": null,
                "pSkuno": null,
                "pName": null,
                "pDesc": null,
                "pQty": null,
                "pPrice": null,
                "pDis": null,
                "pTax": null,
                "pCTax": null,
                "pSTax": null
            }],
            "tDisc": 0,
            "tItems": 0,
            "subTotal": 0,
            "Total": 0,
            "roundOff": 0,
            "CGST": 0,
            "SGST": 0,
            "payType": null,
            "duePay": null
        };


        $scope.productSearch = function() {
            $scope.productNameArray = [];
            $http.get('/skm/productSearch/').then(function(response) {
                var res = response.data;
                for (var i = 0, length = res.length; i < length; i++) {
                    for (obj in res[i]) {
                        $scope.productNameArray.push(res[i][obj]);
                    }
                }
            }, function(response) {});
        };

        $scope.isValidCustPhone = function() {
            if ($scope.customerName.length == 10) {
                $scope.isSearchCust = true;
            } else {
                $scope.isSearchCust = false;
            }
        };

        $scope.getCustomerDetails = function() {
            $scope.customerNameArray = [];
            $http.get('/skm/customerDetails/' + $scope.customerName).then(function(response) {
                var res = response.data;
                for (var i = 0, length = res.length; i < length; i++) {
                    for (obj in res[i]) {
                        $scope.customerNameArray.push(res[i][obj]);
                    }
                }
                if ($scope.customerNameArray.length == 0 || $scope.customerNameArray == undefined) {
                    $scope.isSearchCust = false;
                    $scope.custId = [];
                    $http.get('/skm/getCustomerId/').then(function(response) {
                        var res = response.data;
                        for (var i = 0, length = res.length; i < length; i++) {
                            for (obj in res[i]) {
                                $scope.custId.push(res[i][obj]);
                            }
                        }
                    }, function(response) {});
                    $("#addCustomer").modal();
                } else {
                    $scope.isSearchCust = true;
                    $scope.cusName = $scope.customerNameArray[1];
                    $scope.cusPhone = $scope.customerNameArray[2];
                    $scope.cusEmail = $scope.customerNameArray[3];
                    $scope.cusAddress = $scope.customerNameArray[4];
                    $scope.cusCity = $scope.customerNameArray[5];
                    $scope.cusState = $scope.customerNameArray[6];
                    $scope.cusPinCode = $scope.customerNameArray[7];
                    $("#getCustomer").modal();
                }
            }, function(response) {});
        };

        $scope.selectCust = function() {
            $scope.customerName = $scope.cusName;
            $("#getCustomer").modal('hide');
            $scope.isSearchCust = false;
        }

        $scope.addCust = function() {
            $("#addCustomer").modal('hide');
            $scope.custTitle = '';
            $scope.custMessage = '';
            var newCustId = 'KMCUS' + (parseInt($scope.custId[0].substring(5, 6)) + 1);
            if (newCustId.length != 0) {
                $scope.custId = [];
            }
            var currentDate = '2017-11-27';
            var addNewCustData = {
                id: newCustId,
                name: $scope.addCustName,
                phone: $scope.addCustPhone,
                email: $scope.addCustEmail,
                address: $scope.addCustAddress,
                city: $scope.addCustCity,
                state: $scope.addCustState,
                pincode: $scope.addCustPinCode,
                created: currentDate,
                altphone: $scope.addCustPhone
            }
            $http.post('/skm/addNewCustomer/', addNewCustData).then(function(response) {
                $scope.customerName = $scope.addCustName;
                if (response.data.affectedRows == 1) {
                    $scope.custTitle = "Added";
                    $scope.custMessage = ", Added Successfully.";
                } else {
                    $scope.custTitle = "Failed";
                    $scope.custMessage = ", Added Failed. Please try again.";
                }
                $("#addCustDBMessage").modal();
            }, function(response) {});
        };

        $scope.productDetails = function() {
            var searchFlag = false;
            $scope.productDetail = [];
            $scope.productDis = '';
            $scope.productTax = '';
            $scope.productQTY = '';
            $scope.productPrice = '';
            $scope.productSkuno = '';
            $scope.productDesc = '';
            for (var i = 0, length = $scope.productNameArray.length; i < length; i++) {
                if ($scope.productName == $scope.productNameArray[i]) {
                    searchFlag = true;
                }
            }
            if (searchFlag) {
                searchFlag = false;
                $http.get('/skm/productDetails/' + $scope.productName).then(function(response) {
                    var res = response.data;
                    for (var i = 0, length = res.length; i < length; i++) {
                        for (obj in res[i]) {
                            $scope.productDetail.push(res[i][obj]);
                        }
                    }
                    if ($scope.productDetail.length > 0) {
                        $scope.isValueLoad = true;
                        $scope.isAdd = true;
                        $scope.productDesc = $scope.productDetail[2];
                        $scope.productSkuno = $scope.productDetail[0];
                        $scope.productPrice = $scope.productDetail[3];
                        $scope.productQTY = 1;
                        $scope.productDis = 0;
                        $scope.productTax = $scope.productDetail[4];
                    }
                }, function(response) {});
            }
        };

        $scope.changePrice = function() {
            $scope.productPrice = $scope.productPrice * $scope.productQTY;

        };

        $scope.addProductList = function(pSkuno, pName, pDesc, pQty, pPrice, pDis, pTax) {
            tax = taxSplitCal(pTax);
            $scope.salesProductList.tItems = $scope.salesProductList.tItems + 1;
            $scope.salesProductList['pList'].push({
                "SNo": $scope.salesProductList.tItems,
                "pSkuno": pSkuno,
                "pName": pName,
                "pDesc": pDesc,
                "pQty": pQty,
                "pPrice": subGST(pPrice, pTax),
                "pDis": pDis,
                "pTax": pTax,
                "pCTax": gstTax(pPrice, tax),
                "pSTax": gstTax(pPrice, tax)
            });
            $scope.salesProductList.subTotal = subTotalCal(subGST(pPrice, pTax));
            $scope.salesProductList.CGST = gstCal(gstTax(pPrice, tax), $scope.salesProductList.CGST);
            $scope.salesProductList.SGST = gstCal(gstTax(pPrice, tax), $scope.salesProductList.SGST);
            $scope.salesProductList.Total = totalCal();
            $scope.isAddProduct = true;
            if ($scope.salesProductList.tItems == 1) {
                if ($scope.salesProductList.pList.length >= 1) {
                    $scope.salesProductList.pList.splice(0, 1);
                }
            }

        };

        $scope.generatePreviewBill = function() {
            $("#previewBill").modal();
        };

        function subGST(pPrice, pGST) {
            return (pPrice - (gstTax(pPrice, pGST)));
        }

        function subTotalCal(price) {
            return ($scope.salesProductList.subTotal + price);
        }

        function gstCal(taxAmnt, gstAmnt) {
            return (taxAmnt + gstAmnt);
        }

        function totalCal() {
            return ($scope.salesProductList.subTotal + $scope.salesProductList.tDisc +
                $scope.salesProductList.roundOff + $scope.salesProductList.CGST + $scope.salesProductList.SGST);
        }

        function taxSplitCal(pTax) {
            return tax = pTax / 2;
        }

        function gstTax(price, tax) {
            return Math.round(price * (tax / 100));
        }

        $scope.totDis = function() {
            if ($scope.totDisData) {
                $scope.isTotDis = true;
            } else {
                $scope.isTotDis = false;
            }
        };

        $scope.dueAmnt = function() {
            if ($scope.dueAmntData) {
                $scope.isDueAmnt = true;
            } else {
                $scope.isDueAmnt = false;
            }
        };
    })

.controller('ProductSearchCntlr', function($scope, $http, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$http = $http;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
        $scope.isAddProd = false;
        $scope.isSearchProd = false;
        $scope.getProductDetails = function() {
            $scope.productNameArray = [];
            $http.get('/skm/productDetails/' + $scope.productName).then(function(response) {
                var res = response.data;
                for (var i = 0, length = res.length; i < length; i++) {
                    for (obj in res[i]) {
                        $scope.productNameArray.push(res[i][obj]);
                    }
                }
                if ($scope.productNameArray.length == 0 || $scope.productNameArray == undefined) {
                    $scope.isAddProd = true;
                    $scope.isSearchProd = false;
                    $scope.productName = 'Product Not Found';
                } else {
                    $scope.isAddProd = false;
                    $scope.isSearchProd = true;
                    $scope.productName = $scope.productNameArray[2];
                }
            }, function(response) {});
        };


    })
    .controller('NotificationsCntlr', function($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
    })
    .controller('TranscationsCntlr', function($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
    })
    .controller('ProductBarCodeCntlr', function($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
    })
    .controller('AddCustomerCntlr', function($scope, $http, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$http = $http;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
        $scope.addEditCust = function() {
            $scope.addEditCustNameArray = [];
            $http.get('/skm/customerDetails/' + $scope.addEditCustPhone).then(function(response) {
                var res = response.data;
                for (var i = 0, length = res.length; i < length; i++) {
                    for (obj in res[i]) {
                        $scope.addEditCustNameArray.push(res[i][obj]);
                    }
                }
                if ($scope.addEditCustNameArray.length == 0 || $scope.addEditCustNameArray == undefined) {
                    $scope.addEditCustId = [];
                    $http.get('/skm/getCustomerId/').then(function(response) {
                        var res = response.data;
                        console.log(res);
                        for (var i = 0, length = res.length; i < length; i++) {
                            for (obj in res[i]) {
                                $scope.addEditCustId.push(res[i][obj]);
                            }
                        }
                        if ($scope.addEditCustId.length != 0 && $scope.addEditCustNameArray != undefined) {
                            var newAddEditCustId = 'KMCUS' + (parseInt($scope.addEditCustId[0].substring(5, 6)) + 1);
                            if (newAddEditCustId.length != 0) {
                                $scope.addEditCustId = [];
                            }
                            var currentDate = '2017-11-27';
                            var addEditCustData = {
                                id: newAddEditCustId,
                                name: $scope.addEditCustName,
                                phone: $scope.addEditCustPhone,
                                email: $scope.addEditCustEmail,
                                address: $scope.addEditCustAddress,
                                city: $scope.addEditCustCity,
                                state: $scope.addEditCustState,
                                pincode: $scope.addEditCustPinCode,
                                created: currentDate,
                                altphone: $scope.addEditCustPhone
                            }
                            $http.post('/skm/addNewCustomer/', addEditCustData).then(function(response) {
                                $scope.addEditCustomerName = $scope.addEditCustName;
                                if (response.data.affectedRows == 1) {
                                    $scope.addEditCustTitle = "Added";
                                    $scope.addEditCustMessage = ", Added Successfully.";
                                } else {
                                    $scope.addEditCustTitle = "Failed";
                                    $scope.addEditCustMessage = ", Added Failed. Please try again.";
                                }
                                $("#addEditCustDBMessage").modal();
                            }, function(response) {});
                        }
                    }, function(response) {});
                } else {
                    var newAddEditCustId = $scope.addEditCustNameArray[0];
                    var currentDate = '2017-11-27';
                    var editCustData = {
                        id: newAddEditCustId,
                        name: $scope.addEditCustName,
                        phone: $scope.addEditCustPhone,
                        email: $scope.addEditCustEmail,
                        address: $scope.addEditCustAddress,
                        city: $scope.addEditCustCity,
                        state: $scope.addEditCustState,
                        pincode: $scope.addEditCustPinCode,
                        created: currentDate,
                        altphone: $scope.addEditCustPhone
                    }
                    $http.post('/skm/addEditCustomer/', editCustData).then(function(response) {
                        $scope.addEditCustomerName = $scope.addEditCustName;
                        if (response.data.affectedRows == 1) {
                            $scope.addEditCustTitle = "Updated";
                            $scope.addEditCustMessage = ", Updated Successfully.";
                        } else {
                            $scope.addEditCustTitle = "Updation Failed";
                            $scope.addEditCustMessage = ", Updation Failed. Please try again.";
                        }
                        $("#addEditCustDBMessage").modal();
                    }, function(response) {});
                }
            }, function(response) {});
        };
    })
    .controller('PurchaseInvoiceCntlr', function($scope, $http, $route, $routeParams, $location, toaster) {
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });

        $http.get('/skm/brands').then(function(response) {
            var res = response.data;
            $scope.products = angular.fromJson(res);

        }, function(response) {});

        var taxlist = [];
        var taxes = '';
        $http.get('/skm/taxGroup/').then(function(response) {
            var res = response.data;
            for (i = 0; i < res.length; i++) {
                var group_id = res[i].group_id;
                var group_name = res[i].group_name;
                $http.get('/skm/tax/' + group_id + '/').then(function(response) {
                    var tax = response.data;
                    taxes = '';
                    for (j = 0; j < tax.length; j++) {
                        taxes += tax[j].tax_name + ' ' + tax[j].percentage + '%  ';
                    }
                    taxlist.push({ group_id: group_id, group_name: group_name, taxes: taxes });

                }, function(response) {});
            }
        }, function(response) {});

        $scope.taxes = taxlist;

        $scope.addProduct = function() {
            var data = {
                item_id: $scope.item,
                imei_number: $scope.imeiNumber,
                details: $scope.description,
                price: $scope.price,
                tax_group: $scope.tax,
                bar_code: 'NA',
                in_time: '12345'
            };

            $http.post('/skm/productInsert/', data).then(function(response) {
                output = response.data;

                data.sku_no = output.insertId;

                $http.post('/skm/stockInsert/', data).then(function(response) {
                    toaster.pop("success", "success", "Product Added Successfully");
                    $scope.item = '';
                    $scope.imeiNumber = '';
                    $scope.description = '';
                    $scope.price = '';
                    $scope.tax = '';

                }, function(response) {});

            }, function(response) {});
        }
    })
    .controller('LogoutCntlr', function($scope, $route, $routeParams, $location, $cookieStore) {
        $scope.$location = $location;
        $cookieStore.remove('user');
        $location.path('/');
        $(document).ready(function() {
            if (isWindows) {
                // if we are on windows OS we activate the perfectScrollbar function
                $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

                $('html').addClass('perfect-scrollbar-on');
            } else {
                $('html').addClass('perfect-scrollbar-off');
            }
        });
    });