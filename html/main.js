$(() => {
    const NEXT_BUTTON_SELECTOR = '.page #btn-next';
    const COOLDOWN_SECONDS = 5;

    function startNextButtonCooldown($page, durationSeconds = COOLDOWN_SECONDS) {
        const $button = $page.find('#btn-next').first();

        if ($button.length === 0) {
            return;
        }

        if ($button.data('cooldownTimeout')) {
            clearTimeout($button.data('cooldownTimeout'));
        }

        const originalLabel = $button.data('originalLabel') || $button.text().trim();
        $button.data('originalLabel', originalLabel);

        const durationMs = durationSeconds * 1000;

        $button.addClass('is-loading');
        $button.attr('aria-disabled', 'true');
        $button.text(originalLabel);
        $button.css('--cooldown-duration', `${durationMs}ms`);

        $button.removeClass('loading-active');
        void $button[0].offsetWidth;
        $button.addClass('loading-active');

        const timeoutId = setTimeout(() => {
            $button.removeClass('is-loading loading-active');
            $button.attr('aria-disabled', 'false');
            $button.css('--cooldown-duration', '0ms');
            $button.removeData('cooldownTimeout');
        }, durationMs);

        $button.data('cooldownTimeout', timeoutId);
    }

    window.addEventListener('message', (event) => {
        const data = event.data;

        switch (data.action) {
            case 'open': {
                $('main').fadeIn(500); 
                startNextButtonCooldown($('.page.active').first());
                break;
            }

            case 'close': {
                $('main').fadeOut(500); 
                break;
            }

            case 'playerName': {
                if (data.playerName) {
                    $('#playerName').text(data.playerName);
                }
                break;
            }

            default: break;
        }
    });

    $("#submit").click(function () {
        $.post('https://fazerp-start/submit', JSON.stringify({}));
    });

    $(document).on('click', NEXT_BUTTON_SELECTOR, function() {
        if ($(this).hasClass('is-loading')) {
            return;
        }

        const $current = $(this).closest('.page');
        const $next = $current.next();

        if ($next.length === 0) {
            $('.page').first().addClass('active');
        } else {
            $('.page').removeClass('active');
            $next.addClass('active');
            startNextButtonCooldown($next);
        }
    });

    startNextButtonCooldown($('.page.active').first());
});