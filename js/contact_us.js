    // Function to handle file upload progress
    function uploadFile() {
        console.log("Uploading file...");
        var file = _("file").files[0];
        var formData = new FormData();
        formData.append("file", file);

        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", progressHandler, false);
        xhr.addEventListener("load", completeHandler, false);
        xhr.addEventListener("error", errorHandler, false);
        xhr.addEventListener("abort", abortHandler, false);
        xhr.open("POST", "contact_form_submission.php");
        xhr.send(formData);

        // Show progress bar
        $("#progressContainer").show();
    }

    function progressHandler(event) {
        _("status").innerHTML = Math.round((event.loaded / event.total) * 100) + "% uploaded... please wait";
        _("progressBar").value = Math.round((event.loaded / event.total) * 100);
    }

    function completeHandler(event) {
        console.log("File upload complete.");
        _("status").innerHTML = event.target.responseText;
        _("progressBar").value = 0; // Reset progress bar after successful upload

        // Hide progress bar
        $("#progressContainer").hide();
    }

    function errorHandler(event) {
        _("status").innerHTML = "Upload Failed";
    }

    function abortHandler(event) {
        _("status").innerHTML = "Upload Aborted";
    }

    function _(el) {
        return document.getElementById(el);
    }

    // Function to validate email format
    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to validate phone format
    function isValidPhone(phone) {
        var phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    }

    // Function to display response message
    function displayResponse(message, isError) {
        var responseContainer = $("#responseContainer");
        responseContainer.empty();
        responseContainer.append("<p style='color: " + (isError ? "red" : "green") + "'>" + message + "</p>");
    }

    $(document).ready(function() {
        $("#submitBtn").click(function(event) {
            // Prevent the default form submission behavior
            event.preventDefault();
            
            // Disable the submit button to prevent multiple submissions
            $("#submitBtn").prop("disabled", true);

            // Show loading animation
            $("#submitBtn").html('<i class="fas fa-spinner fa-spin"></i> Sending...');

            // Verify the reCAPTCHA before proceeding
            var captchaResponse = grecaptcha.getResponse();
            if (captchaResponse === "") {
                displayResponse("Please complete the reCAPTCHA verification.", true);
                // Enable the submit button and reset its text
                $("#submitBtn").prop("disabled", false).html('Send Message <i class="fal fa-long-arrow-right"></i>');
                return;
            }

            var name = $("#name").val();
            var email = $("#email").val();
            var phone = $("#phone").val();
            var enquireFor = $("#enquireFor").val();
            var message = $("#message").val();

            // Function to validate phone format live
            $("#phone").on("input", function() {
                var phone = $(this).val();
                // Remove non-numeric characters
                phone = phone.replace(/\D/g, '');
                $(this).val(phone);
                if (phone.trim() !== '' && !isValidPhone(phone.trim())) {
                    displayResponse("Please Enter 10 Digits Number.", true);
                } else {
                    $("#responseContainer").empty();
                }
            });

            // Client-side validation
            if (email.trim() !== '' && !isValidEmail(email.trim())) {
                displayResponse("Please enter a valid email address", true);
                // Enable the submit button and reset its text
                $("#submitBtn").prop("disabled", false).html('Send Message <i class="fal fa-long-arrow-right"></i>');
                return; // Prevent form submission if email is invalid
            }
            if (phone.trim() === '' || !isValidPhone(phone.trim())) {
                displayResponse("Phone Number is Required Field", true);
                // Enable the submit button and reset its text
                $("#submitBtn").prop("disabled", false).html('Send Message <i class="fal fa-long-arrow-right"></i>');
                return;
            }

            // Create a FormData object to handle file upload
            var formData = new FormData();
            var fileInput = $('#file')[0].files[0];
            formData.append('file', fileInput);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('enquire_for', enquireFor);
            formData.append('message', message);
            formData.append('submitBtn', true); // Add a flag to indicate form submission

            // AJAX submission for file upload and form data
            $.ajax({
                url: 'verify_recaptcha.php',
                type: 'POST',
                data: {'g-recaptcha-response': captchaResponse},
                dataType: "json",
                success: function(data) {
                    if (data.status == 1) {
                        // Proceed with form submission
                        $.ajax({
                            url: 'contact_form_submission.php',
                            type: 'POST',
                            data: formData,
                            contentType: false,
                            processData: false,
                            success: function(response) {
                                // Enable the submit button and reset its text
                                $("#submitBtn").prop("disabled", false).html('Send Message <i class="fal fa-long-arrow-right"></i>');
                                displayResponse(response, false);
                                $("#contactForm")[0].reset(); // Reset form
                            },
                            error: function(xhr, status, error) {
                                // Enable the submit button and reset its text
                                $("#submitBtn").prop("disabled", false).html('Send Message <i class="fal fa-long-arrow-right"></i>');
                                displayResponse("An error occurred while processing your request.", true);
                                console.log(xhr.responseText); // Log error message
                            }
                        });
                    } else {
                        // Show error message
                        displayResponse(data.msg, true);

                        // Enable the submit button and reset its text
                        $("#submitBtn").prop("disabled", false).html('Send Message <i class="fal fa-long-arrow-right"></i>');
                    }
                },
                error: function(xhr, status, error) {
                    // Enable the submit button and reset its text
                    $("#submitBtn").prop("disabled", false).html('Send Message <i class="fal fa-long-arrow-right"></i>');
                    displayResponse("An error occurred while verifying the reCAPTCHA.", true);
                    console.log(xhr.responseText); // Log error message
                }
            });
        });
    });
