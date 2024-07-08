        // Initialize Fancybox
        $(document).ready(function () {
            if (window.matchMedia("(min-width: 768px)").matches) {
                $("[data-fancybox='gallery']").fancybox({
                    buttons: [
                        'zoom',
                        'slideShow',
                        'fullScreen',
                        'thumbs',
                        'close',
                        'share'
                    ],
                    thumbs: {
                        autoStart: true // Enable autoStart for tablets and desktops
                    }
                });
            } else {
                // Initialize Fancybox with options without autoStart for smaller devices
                $("[data-fancybox='gallery']").fancybox({
                    buttons: [
                        'zoom',
                        'slideShow',
                        'fullScreen',
                        'thumbs',
                        'close',
                        'share'
                    ],
                    thumbs: {
                        autoStart: false // Disable autoStart for smaller devices
                    }
                });
            }
        });