import { modalController } from '@ionic/vue';
import InstallModal from '../components/InstallModal.vue';
import IosModal from '../components/IosModal.vue';
import AlternativesModal from '../components/AlternativesModal.vue';

export async function check_installation() {
    if (!user_can_install()) return;

    if (is_ios() && !('BeforeInstallPromptEvent' in window)) {
        show_modal(IosModal);
        return;
    }

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        const prompt = event;

        show_modal(InstallModal, {
            browser_prompt: prompt,
        });
    });
}

function user_can_install() {
    if (
        typeof window == 'undefined' ||
        navigator.standalone ||
        window.matchMedia('(display-mode: standalone)').matches
    )
        return false;

    if (
        ('serviceWorker' in navigator &&
            'BeforeInstallPromptEvent' in window) ||
        is_ios()
    ) {
        return true;
    }

    show_modal(AlternativesModal);
    return false;
}

function is_ios() {
    return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    );
}

async function show_modal(modal_component, modal_props = {}) {
    const modal = await modalController.create({
        component: modal_component,
        componentProps: modal_props,
    });
    modal.present();
}
