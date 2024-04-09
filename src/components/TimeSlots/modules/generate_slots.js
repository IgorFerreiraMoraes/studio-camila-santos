import { database, auth } from '../../../firebase';
import {
    collection,
    query,
    where,
    onSnapshot,
    Timestamp,
    or,
    and,
    getDocs,
} from 'firebase/firestore';
import { eachMinuteOfInterval, addMinutes } from 'date-fns';

export async function generate_slots(options) {
    const {
        start_hour,
        ending_hour,
        slot_duration_minutes,
        selected_day,
        staff_id,
    } = options;

    const interval = generate_interval(
        start_hour,
        ending_hour,
        selected_day,
    );

    const all_slots_in_interval = eachMinuteOfInterval(interval, {
        step: slot_duration_minutes,
    });

    const existing_appointments = await fetch_existing_appointments(
        selected_day,
        auth.currentUser.uid,
        staff_id,
    );

    const available_slots_in_interval = filter_overlapping_slots(
        all_slots_in_interval,
        slot_duration_minutes,
        existing_appointments,
        selected_day,
    );

    return available_slots_in_interval;
}

function generate_interval(start_hour, ending_hour, selected_day) {
    const selected_day_start = new Date(selected_day);
    const selected_day_end = new Date(selected_day);

    selected_day_start.setHours(start_hour);
    selected_day_end.setHours(ending_hour);

    return { start: selected_day_start, end: selected_day_end };
}

async function fetch_existing_appointments(
    selected_day,
    user_id,
    staff_id,
) {
    const day_query = query(
        collection(database, 'appointments'),
        and(
            where('date', '==', selected_day),
            or(
                where('staff_id', '==', staff_id),
                where('client_id', '==', user_id),
            ),
        ),
    );

    const existing_appointments_snapshot = await getDocs(day_query);
    const existing_appointmnets =
        existing_appointments_snapshot.docs.map((doc) => doc.data());

    return existing_appointmnets;
}

function filter_overlapping_slots(
    slots,
    slot_duration_minutes,
    existing_appointments,
    selected_day,
) {
    return slots.filter(
        (slot) =>
            !is_slot_overlapping_with_appointments(
                slot,
                slot_duration_minutes,
                existing_appointments,
                selected_day,
            ),
    );
}

function is_slot_overlapping_with_appointments(
    slot,
    slot_duration_minutes,
    existing_appointments,
    selected_day,
) {
    const slot_start = Timestamp.fromDate(slot).seconds;
    const slot_end = Timestamp.fromDate(
        addMinutes(slot, slot_duration_minutes),
    ).seconds;

    if (slot_start < Timestamp.fromDate(new Date()).seconds) {
        return true;
    }

    const lunch_start = new Date(selected_day);
    const lunch_end = new Date(selected_day);
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

    if (!existing_appointments.length) return false;

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
    if (start1 == start2 || end1 == end2) return true;

    return start1 < end2 && start2 < end1;
}
