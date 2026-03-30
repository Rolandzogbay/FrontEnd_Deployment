import axios from "axios";
import { computed, ref } from "vue";

// const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_ROOT = "http://localhost:5000/api";
const NOTIFICATION_API = `${API_ROOT}/notifications`;

export function useProductNotifications() {
    const notifications = ref([]);
    const loadingNotifications = ref(false);

    const getToken = () => localStorage.getItem("token");

    const axiosConfig = () => ({
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    const unreadNotificationsCount = computed(
        () => notifications.value.filter((n) => !n.is_read).length
    );

    const fetchNotifications = async () => {
        loadingNotifications.value = true;

        try {
            const response = await axios.get(NOTIFICATION_API, axiosConfig());
            notifications.value = Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            loadingNotifications.value = false;
        }
    };

    const clearNotifications = async () => {
        try {
            await axios.delete(NOTIFICATION_API, axiosConfig());
            notifications.value = [];
        } catch (error) {
            console.error("Failed to clear notifications:", error);
        }
    };

    const markNotificationRead = async (notificationId) => {
        try {
            await axios.patch(`${NOTIFICATION_API}/${notificationId}/read`, {}, axiosConfig());
            notifications.value = notifications.value.map((n) =>
                n.id === notificationId ? { ...n, is_read: true } : n
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const formatNotificationTime = (dateValue) => {
        if (!dateValue) return "";

        const now = new Date();
        const then = new Date(dateValue);
        const diffMs = now - then;

        const minutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMs / 3600000);
        const days = Math.floor(diffMs / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        return `${days} day${days > 1 ? "s" : ""} ago`;
    };

    return {
        notifications,
        loadingNotifications,
        unreadNotificationsCount,
        fetchNotifications,
        clearNotifications,
        markNotificationRead,
        formatNotificationTime,
    };
}