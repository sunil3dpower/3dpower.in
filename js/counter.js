// counter start 
 
  // Function to start the counter when the element comes into view
        function startCounterWhenVisible(entries, observer) {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              let valueDisplay = entry.target.querySelector(".num");
              let startValue = 0;
              let endValue = parseInt(valueDisplay.getAttribute("data-val"));
              let range = endValue - startValue;
              let interval = 2000; // Adjust as needed
              let startTime;
      
              function updateCounter(timestamp) {
                if (!startTime) startTime = timestamp;
                let elapsedTime = timestamp - startTime;
                let progress = Math.min(elapsedTime / interval, 1); // Ensure progress doesn't exceed 1
                let currentValue = Math.floor(progress * range) + startValue;
                valueDisplay.textContent = currentValue.toLocaleString() + "+"; // Append plus sign
                if (progress < 1) {
                  requestAnimationFrame(updateCounter);
                }
              }
      
              requestAnimationFrame(updateCounter);
              observer.unobserve(entry.target); // Stop observing once it's in view
            }
          });
        }
      
        // Set up the intersection observer
        let options = {
          root: null,
          rootMargin: '0px',
          threshold: 0.5 // Adjust as needed
        };
        let observer = new IntersectionObserver(startCounterWhenVisible, options);
      
        // Observe each element with the class "container-counter"
        let containerCounters = document.querySelectorAll('.container-counter');
        containerCounters.forEach(counter => {
          observer.observe(counter);
        });

//counter end 