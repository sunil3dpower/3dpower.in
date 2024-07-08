$(document).ready(function() {
    // Check if the device width is greater than or equal to 1065 pixels
    if ($(window).width() >= 1065) {
        var leftPanel = $('.left-panel');
        var header = $('.main-header');
        var wrapper = $('#wrapper');
        var content = $('.content');
        var animationDuration = 300; // Animation duration in milliseconds

        // Function to handle scroll event
        function handleScroll() {
            var scrollTop = $(window).scrollTop();
            // var videoHeight = $('.video-wrapper').outerHeight() - 160;
            var videoHeight = 200;
            var animationStart = 0;
            var animationEnd = 90;

            // Calculate progress based on scroll position
            var progress = Math.min(scrollTop / videoHeight, 1); // Limit progress to 1

            // Define styles for wrapper and header
             var wrapperStyles = {
             top: animationStart + 'px',
            };
            var headerStyles = {};
            var leftPanelStyles = {};

            // If scrolled below video, update styles
            if (scrollTop > videoHeight) {
                 wrapperStyles.top = animationEnd + 'px';
                // wrapperStyles.left = animationEnd + 'px';
                headerStyles.height = animationEnd + 'px';
                leftPanelStyles.width = animationEnd + 'px';
            } else {
                wrapperStyles.top = animationStart + 'px';
                headerStyles.height = animationStart + 'px';
                leftPanelStyles.width = animationStart + 'px';
            }

            // Animate wrapper and header elements
            wrapper.stop().animate(wrapperStyles, animationDuration);
            header.stop().animate(headerStyles, animationDuration);
            leftPanel.stop().animate(leftPanelStyles, animationDuration);

            // Toggle classes based on scroll position
            header.toggleClass('video-playing', scrollTop <= videoHeight);
            leftPanel.toggleClass('video-playing', scrollTop <= videoHeight);
            wrapper.toggleClass('video-playing', scrollTop <= videoHeight);
        }

        // Call handleScroll initially
        handleScroll();

        // Attach handleScroll to window scroll event
        $(window).scroll(function() {
            handleScroll();
        });
    }
});