'use strict';

var global;

var finished = Array();
var data = {
    labels: ["NxVxR review", "Wxtchx review", "Harry Potter", "Lord of the Rings"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [51114728, 27556222, 1084000, 473000]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.5)",
            strokeColor: "rgba(151,187,205,0.8)",
            highlightFill: "rgba(151,187,205,0.75)",
            highlightStroke: "rgba(151,187,205,1)",
            data: [7594020, 2523652, 0, 0]
        }
    ]
};
var ctx = document.getElementById("myChart").getContext("2d");
var myBarChart = new Chart(ctx).Bar(data, {scaleShowLabels: true});

var reviewApp = angular.module('reviewApp',['wu.masonry','angular-loading-bar'])
.directive('reviewDirective', ['$timeout', function($timeout) {
  return function(scope, element, attrs) {
    if (scope.$last){
      $timeout(function () {
        $('div.raty').raty({
          size: 20,
          path: '/static/img',
          score: function() {
            return $(this).attr('data-score');
          }
        });
      }, 0, false);

      $timeout(function () {
        /* progress bar animation when visible4 */
        var imgLoad = imagesLoaded($('.poster'));
        imgLoad.on( 'always', function( instance ) {
          console.log('ALWAYS - all images have been loaded');
          var container = document.querySelector('#reviews');
          var msnry = new Masonry( container, {
            itemSelector: '.review',
            columnWidth: '.col-md-6',
            gutter: 0
          });

          $('.poster').tooltip();
        });
       
        var $meters = $(".progress-bar");
        $meters.bind('inview', function (event, visible) {
          if (visible == true) {
            var $el = $(this);
            var origWidth = $el.width();

            if (finished.indexOf($el[0].id) == -1) {
              var origWidth = $el.width();
              $el.css("width",$el.attr('data')+"%");
              finished.push($el[0].id);
              //$queue.queue(function(next) {
              global=$el;
              
              //$el.animate({width: origWidth}, "slow", "swing");
            };
          }
        });
        /*$meters.each(function() {
          var $el = $(this);
        });
        $(function() {
          var $meters = $(".progress-bar");
          //var $section = $('#movie-demo');
          var $queue = $({});
          
          $(document).bind('scroll', function(ev) {
            var scrollOffset = $(document).scrollTop();
            $meters.each(function() {
              var $el = $(this);
              
              var containerOffset = $el.offset().top - window.innerHeight;
              var scrollOffset = $(document).scrollTop();

              if (finished.indexOf($el[0].id) == -1 && scrollOffset > containerOffset) {
                finished.push($el[0].id);
                var origWidth = $el.width();
                $el.css("width",0);

                //$queue.queue(function(next) {
                global=$el;
                $el.animate({width: origWidth}, 100000, "swing");
                console.log("123");
                //});
                // unbind event not to load scrolsl again
                //$(document).unbind('scroll');
              }
            });
          });
        });*/ 
      }, 1, false);
    }
  };
}]).filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

var reviews = [];

reviewApp.controller('reviewController', function($scope, $http) {
  $scope.reviews = [];
  $scope.sentences = [];

  $scope.prediction = function() {
    //$http.post('/r/predict', data).success(function(data) {
    $http({url:'/r/predict',
           data: {text: $('#text')[0].value},
           method: 'POST',
           transformRequest: function(obj) {
             var str = [];
             for(var p in obj)
             str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
             return str.join("&");
           },
           headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function(data) {
      $scope.sentences.push({text:data.data[0].text[1], pred:data.data[0].pred});
    });
  };

  //$http.get('/r/get/20').success(function(data) {
  $http.get('/r/cached/50').success(function(data) {
    reviews = data.data;
    $scope.reviews = data.data;
  });

  $scope.prediction();
});
