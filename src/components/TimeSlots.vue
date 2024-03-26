<template>
    <ion-toolbar>
        <ion-title>Horários</ion-title>
    </ion-toolbar>
    <ion-select
        aria-label="Escolha uma Profissional"
        interface="popover"
        placeholder="Com quem marcar?"
        @ion-change="handle_staff_selection($event)"
    >
        <ion-select-option
            v-for="staff of staff_reference"
            :value="staff"
            :key="staff"
        >
            {{ staff.name }}
        </ion-select-option>
    </ion-select>
    <ion-select
        v-if="selected_staff"
        aria-label="Escolha o Procedimento Estético"
        interface="popover"
        placeholder="Qual Procedimento?"
        v-model="selected_service"
    >
        <ion-select-option
            v-for="service of selected_staff.services"
            :value="service"
            :key="service.name"
        >
            {{ service.name }}
        </ion-select-option>
    </ion-select>
    <ul
        v-if="
            available_slots.length > 0 &&
            selected_staff &&
            selected_service
        "
    >
        <li
            v-for="slot in available_slots"
            :key="slot"
            :class="{ selected: selected_slot == slot }"
            @click="handle_slot_selection(slot)"
        >
            <p>
                {{ format(slot, 'kk:mm') }} -
                {{
                    format(
                        addMinutes(slot, selected_service.duration),
                        'kk:mm',
                    )
                }}
            </p>
        </li>
    </ul>
    <p
        class="cta"
        v-else-if="
            available_slots.length == 0 &&
            selected_staff &&
            selected_service
        "
    >
        Parece que não temos como te encaixar no dia escolhido.
        Selecione outro dia!
    </p>
    <p
        class="cta"
        v-else
    >
        Pronta para brilhar? <br />
        Escolha uma profissional e um procedimento que veremos se há
        horários disponíveis para você!
    </p>
    <ion-fab
        slot="fixed"
        vertical="bottom"
        horizontal="center"
    >
        <ion-fab-button
            aria-label="Fazer agendamento"
            color="tertiary"
            @click="confirm_appointment()"
        >
            <ion-icon :icon="checkmarkOutline"></ion-icon>
        </ion-fab-button>
    </ion-fab>
</template>
<script setup>
    import {
        IonSelect,
        IonSelectOption,
        IonFab,
        IonFabButton,
        IonIcon,
        IonTitle,
        IonToolbar,
        alertController,
    } from '@ionic/vue';
    import { checkmarkOutline } from 'ionicons/icons';
    import { ref, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { staff_reference } from '../modules/bussiness_reference';
    import { database, auth } from '../firebase';
    import {
        collection,
        doc,
        setDoc,
        query,
        where,
        onSnapshot,
        Timestamp,
        or,
        and,
    } from 'firebase/firestore';
    import { addMinutes, eachMinuteOfInterval, format } from 'date-fns';
    import ptBR from 'date-fns/locale/pt-BR';

    const router = useRouter();
    const props = defineProps(['selected_day']);

    const available_slots = ref([]);
    const selected_slot = ref();
    const selected_service = ref();
    const selected_staff = ref();

    watch(selected_service, async () => {
        if (selected_service.value) render_slots();
    });
    watch(props, () => {
        selected_service.value = null;
    });

    function handle_staff_selection($event) {
        selected_staff.value = $event.detail.value;
        selected_service.value = null;
    }
    function handle_slot_selection(slot) {
        if (!selected_service.value) return;
        selected_slot.value = slot;
    }

    async function render_slots() {
        const day_of_week = props.selected_day.getDay();
        let start_hour = 7;
        let ending_hour = 7;
        if (day_of_week == 0) {
            ending_hour = 7;
        } else if (day_of_week == 1 || day_of_week == 2) {
            ending_hour = 18;
        } else if (
            day_of_week == 3 ||
            day_of_week == 4 ||
            day_of_week == 5
        ) {
            ending_hour = 19;
        } else if (day_of_week == 6) {
            ending_hour = 17;
        }

        available_slots.value = await generate_slots(
            start_hour,
            ending_hour,
            selected_service.duration,
        );
    }

    async function generate_slots(
        start_hour,
        ending_hour,
        slot_duration_minutes,
    ) {
        const interval = generate_interval(start_hour, ending_hour);

        const all_slots_in_interval = eachMinuteOfInterval(interval, {
            step: slot_duration_minutes,
        });

        const existing_appointments = await fetch_existing_appointments(
            props.selected_day,
        );

        const available_slots_in_interval = filter_overlapping_slots(
            all_slots_in_interval,
            slot_duration_minutes,
            existing_appointments,
        );

        return available_slots_in_interval;
    }

    function generate_interval(start_hour, ending_hour) {
        const selected_day_start = new Date(props.selected_day);
        const selected_day_end = new Date(props.selected_day);

        selected_day_start.setHours(start_hour);
        selected_day_end.setHours(ending_hour);

        return { start: selected_day_start, end: selected_day_end };
    }

    function fetch_existing_appointments(day) {
        const day_query = query(
            collection(database, 'appointments'),
            and(
                where('date', '==', day),
                or(
                    where('staff_id', '==', selected_staff.value.id),
                    where('client_id', '==', auth.currentUser.uid),
                ),
            ),
        );

        return new Promise((resolve) => {
            let existing_appointments = [];

            const appointments_listener = onSnapshot(
                day_query,
                (snap) => {
                    existing_appointments = snap.docs.map(
                        (appointment) => appointment.data(),
                    );
                    resolve(existing_appointments);
                },
            );
        });
    }

    function filter_overlapping_slots(
        slots,
        slot_duration_minutes,
        existing_appointments,
    ) {
        return slots.filter(
            (slot) =>
                !is_slot_overlapping_with_appointments(
                    slot,
                    slot_duration_minutes,
                    existing_appointments,
                ),
        );
    }

    function is_slot_overlapping_with_appointments(
        slot,
        slot_duration_minutes,
        existing_appointments,
    ) {
        const slot_start = Timestamp.fromDate(slot).seconds;
        const slot_end = Timestamp.fromDate(
            addMinutes(slot, slot_duration_minutes),
        ).seconds;

        if (slot_start < Timestamp.fromDate(new Date()).seconds) {
            return true;
        }
        if (!existing_appointments.length) return false;

        const lunch_start = new Date(props.selected_day);
        const lunch_end = new Date(props.selected_day);
        lunch_start.setHours(12, 0, 0, 0);
        lunch_end.setHours(13, 0, 0, 0);

        if (
            are_intervals_overlapping(
                slot_start,
                slot_end,
                Timestamp.fromDate(lunch_start).seconds,
                Timestamp.fromDate(lunch_end).seconds,
            )
        ) {
            return true;
        }

        return existing_appointments.some((appointment) =>
            are_intervals_overlapping(
                slot_start,
                slot_end,
                appointment.start_time.seconds,
                appointment.end_time.seconds,
            ),
        );
    }

    function are_intervals_overlapping(start1, end1, start2, end2) {
        return (
            (start1 <= start2 && end1 >= end2) ||
            (start1 > start2 && end1 < end2) ||
            (start1 <= start2 && end1 > start2) ||
            (start1 < end2 && end1 >= end2)
        );
    }

    async function confirm_appointment() {
        if (
            !selected_service.value ||
            !selected_slot.value ||
            !selected_staff.value
        )
            return;

        const confirm_alert = await create_confirmation_alert();
        await confirm_alert.present();
    }

    function create_confirmation_alert() {
        return alertController.create({
            header: 'Marcar nesta data e horário?',
            subHeader: `Dia ${format(
                props.selected_day,
                `d 'de' MMMM`,
                {
                    locale: ptBR,
                    addSuffix: true,
                },
            )} às ${format(selected_slot.value, `p`, {
                locale: ptBR,
            })}`,
            buttons: [
                {
                    text: 'Não',
                    role: 'cancel',
                },
                {
                    text: 'Sim',
                    role: 'submit',
                    handler: async () => {
                        make_appointment();
                    },
                },
            ],
        });
    }

    async function make_appointment() {
        const appointment_id = `${auth.currentUser.uid}_${
            selected_service.value.name
        }_${new Date().getTime()}`;

        await setDoc(doc(database, 'appointments', appointment_id), {
            client_id: auth.currentUser.uid,
            client_name: auth.currentUser.displayName,
            staff_id: selected_staff.value.id,
            staff_name: selected_staff.value.name,
            date: props.selected_day,
            service: selected_service.value.name,
            start_time: selected_slot.value,
            end_time: addMinutes(
                selected_slot.value,
                selected_service.value.duration,
            ),
        });
        render_slots();
        router.push('/obrigada');
    }
</script>
<style scoped>
    p.cta {
        max-width: min(400px, 90%);
        margin: 1.55rem auto;
    }
    ion-title {
        font-weight: 400;
        background-color: white;
    }
    ul {
        display: grid;
        grid-template-columns: 1fr 1fr;
        overflow-y: scroll;
        height: calc(100vh - 465px);
        padding: 0 24px 8px 24px;
        gap: 8px;
    }
    li {
        border: #302571 1px solid;
        text-align: center;
        border-radius: 8px;
        list-style: none;
        color: #302571;
        transition: 0.15s;
    }
    li:hover {
        background-color: #f4f5f8;
        cursor: pointer;
    }
    li.selected {
        background-color: #302571;
        color: white;
    }

    ion-select {
        display: grid;
        place-content: center;
    }

    ion-fab {
        margin-bottom: 12px;
    }
</style>
