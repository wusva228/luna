
import type { User, Rating, Ticket, PremiumRequest, Report, AgeVerificationRequest, UnbanRequest } from '../types';
import { calculateDistance } from '../utils/geolocation';
import { v4 as uuidv4 } from 'uuid';

const ADMIN_ID = 7264453091;

// Helper to get data from localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    // KEY FIX: Validate data from localStorage. If it's corrupted, reset to default.
    const parsed = item ? JSON.parse(item) : defaultValue;
    return Array.isArray(parsed) ? parsed as T : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

// Helper to set data to localStorage
const setInStorage = <T>(key: string, value: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};

const initialUsers: User[] = [
    { id: ADMIN_ID, username: 'wusva', name: 'Администратор', email: 'admin@luna.app', age: 30, gender: 'male', bio: 'Обеспечиваю порядок и веселье в Luna Dating.', photoUrls: ['https://ucarecdn.com/a6d94669-e389-4235-812e-15822deb257a/'], isVerified: true, isPremium: true, isBlocked: false, lastLogin: 0, shareLocation: true, location: { lat: 55.7558, lon: 37.6176 }, city: 'Москва', isAgeVerified: true },
    { id: 101, username: 'jessica_art', name: 'Джессика', email: 'jess@example.com', age: 24, gender: 'female', bio: 'Люблю искусство, музыку и спонтанные приключения. Ищу кого-то с хорошим чувством юмора.', photoUrls: ['https://ucarecdn.com/3e1a5412-329e-43a3-9584-399a385458ed/'], isVerified: true, isPremium: true, isBlocked: false, lastLogin: 0, height: 170, zodiacSign: 'Весы', eyeColor: 'Голубой', shareLocation: true, location: { lat: 55.76, lon: 37.62 }, city: 'Москва', isAgeVerified: true },
    { id: 102, username: 'mike_climbs', name: 'Майк', email: 'mike@example.com', age: 28, gender: 'male', bio: 'Днем программист, по выходным скалолаз. Моя собака - мой лучший друг.', photoUrls: ['https://ucarecdn.com/e5f6a273-a4b5-4348-933e-5a7a72382a85/'], isVerified: false, isPremium: false, isBlocked: false, lastLogin: 0, height: 182, weight: 80, preferences: 'Горы, код, собаки', shareLocation: true, location: { lat: 55.75, lon: 37.61 }, city: 'Москва', isAgeVerified: false },
    { id: 103, username: 'chloe_travels', name: 'Хлоя', email: 'chloe@example.com', age: 26, gender: 'female', bio: 'Путешественница и гурман. Вероятно, смогу победить тебя в Mario Kart.', photoUrls: ['https://ucarecdn.com/c6397d91-ab5b-4c74-8461-104443831b0e/'], isVerified: false, isPremium: false, isBlocked: false, lastLogin: 0, zodiacSign: 'Стрелец', badHabits: 'Прокрастинация', shareLocation: false, isAgeVerified: false },
    { id: 104, username: 'david_fit', name: 'Давид', email: 'david@example.com', age: 31, gender: 'male', bio: 'Фитнес-энтузиаст и начинающий шеф-повар. Верю, что хороший разговор — лучшее первое свидание.', photoUrls: ['https://ucarecdn.com/1c97a898-1563-44f7-87d7-d86b89f81648/'], isVerified: true, isPremium: false, isBlocked: false, lastLogin: 0, height: 185, weight: 85, shareLocation: true, location: { lat: 59.9343, lon: 30.3351 }, city: 'Санкт-Петербург', isAgeVerified: true },
    { id: 105, name: 'София', username: 'sophia_reads', email: 'sophia@mail.ru', age: 22, gender: 'female', bio: 'Библиотекарь с душой панк-рокера. Обсудим последнюю книгу или сходим на концерт?', photoUrls: ['https://ucarecdn.com/39b85c15-4654-4638-89c5-8494c25f7783/'], isVerified: false, isPremium: false, isBlocked: false, lastLogin: 0, shareLocation: true, location: { lat: 59.94, lon: 30.34 }, city: 'Санкт-Петербург', isAgeVerified: false },
    { id: 106, name: 'Иван', username: 'ivan_bakes', email: 'ivan@mail.ru', age: 29, gender: 'male', bio: 'Пеку лучший в городе хлеб. Могу научить, если пообещаешь делиться.', photoUrls: ['https://ucarecdn.com/5ca78351-5a23-4581-9b4f-b1e6002f2316/'], isVerified: false, isPremium: false, isBlocked: true, banReason: 'Ненормативная лексика в профиле.', lastLogin: 0, shareLocation: false, isAgeVerified: false },
    { id: 107, name: 'Елена', username: 'elena_yoga', email: 'elena@mail.ru', age: 33, gender: 'female', bio: 'Инструктор по йоге. Ищу гармонию во всем, включая отношения.', photoUrls: ['https://ucarecdn.com/9735d1b7-a3d8-42f7-b2e1-807d885f8bdc/'], isVerified: true, isPremium: true, isBlocked: false, lastLogin: 0, shareLocation: true, location: { lat: 55.758, lon: 37.615 }, city: 'Москва', isAgeVerified: true },
    { id: 108, name: 'Артур', username: 'arthur_dj', email: 'art@dj.com', age: 25, gender: 'male', bio: 'Диджей. Живу по ночам. Ищу ту, что разделит со мной рассвет.', photoUrls: ['https://ucarecdn.com/b163832c-b5f7-4187-920f-b2586cf6289b/'], isVerified: false, isPremium: false, isBlocked: false, lastLogin: 0, shareLocation: true, location: { lat: 55.80, lon: 37.60 }, city: 'Москва', isAgeVerified: false },
    { id: 109, name: 'Мария', username: 'maria_vet', email: 'maria@vet.com', age: 29, gender: 'female', bio: 'Ветеринар. Люблю животных больше, чем людей. Но для тебя сделаю исключение.', photoUrls: ['https://ucarecdn.com/599951e7-f58c-4a30-8d59-59d4355a297e/'], isVerified: true, isPremium: false, isBlocked: false, lastLogin: 0, shareLocation: true, location: { lat: 55.70, lon: 37.65 }, city: 'Москва', isAgeVerified: false },
    { id: 110, name: 'Петр', username: 'peter_photo', email: 'peter@photo.com', age: 35, gender: 'male', bio: 'Фотограф. Вижу красоту в мелочах. Покажи мне свой мир.', photoUrls: ['https://ucarecdn.com/a42b930b-0441-443b-8777-a859a859a721/'], isVerified: false, isPremium: true, isBlocked: false, lastLogin: 0, shareLocation: false, isAgeVerified: true },
    { id: 111, name: 'Анна', username: 'anna_design', email: 'anna@design.com', age: 27, gender: 'female', bio: 'Графический дизайнер. Ценю эстетику и минимализм.', photoUrls: ['https://ucarecdn.com/3e5c72e2-d850-45a7-b2f5-9a84a299d54e/'], isVerified: false, isPremium: false, isBlocked: false, lastLogin: 0, shareLocation: true, location: { lat: 59.93, lon: 30.33 }, city: 'Санкт-Петербург', isAgeVerified: false },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const createApi = <T extends {id: any}>(storageKey: string, initialData: T[]) => {
    let data = getFromStorage(storageKey, initialData);

    return {
        async getAll(): Promise<T[]> {
            await simulateDelay(50);
            return data;
        },
        async getById(id: any): Promise<T | undefined> {
            await simulateDelay(20);
            return data.find(item => item.id === id);
        },
        async create(itemData: Omit<T, 'id'>): Promise<T> {
            await simulateDelay(50);
            const newItem = { ...itemData, id: uuidv4() } as T;
            data = [...data, newItem];
            setInStorage(storageKey, data);
            return newItem;
        },
        async update(id: any, updates: Partial<T>): Promise<T | null> {
            await simulateDelay(50);
            let updatedItem: T | null = null;
            data = data.map(item => {
                if (item.id === id) {
                    updatedItem = { ...item, ...updates };
                    return updatedItem;
                }
                return item;
            });
            if (updatedItem) {
                setInStorage(storageKey, data);
            }
            return updatedItem;
        },
    };
};

const userApi = createApi<User>('luna_users', initialUsers);
const ratingApi = createApi<Rating>('luna_ratings', []);
const ticketApi = createApi<Ticket>('luna_tickets', []);
const premiumRequestApi = createApi<PremiumRequest>('luna_premium_requests', []);
const reportApi = createApi<Report>('luna_reports', []);
const ageVerificationRequestApi = createApi<AgeVerificationRequest>('luna_age_verification_requests', []);
const unbanRequestApi = createApi<UnbanRequest>('luna_unban_requests', []);

// User API
export const getUsers = () => userApi.getAll();
export const getUserById = (id: number) => userApi.getById(id);
export const addUser = (user: User) => userApi.create(user);
export const updateUser = (updates: Partial<User> & { id: number }) => {
    return userApi.update(updates.id, updates);
};

// Rating API
export const getRatings = () => ratingApi.getAll();
export const addRating = (ratingData: Omit<Rating, 'id'>) => ratingApi.create(ratingData);

// Ticket API
export const getTickets = () => ticketApi.getAll();
export const addTicket = (ticketData: Omit<Ticket, 'id' | 'timestamp' | 'status'>) => {
    const newTicket: Omit<Ticket, 'id'> = { ...ticketData, timestamp: Date.now(), status: 'open' };
    return ticketApi.create(newTicket);
};
export const updateTicketStatus = (id: string, status: 'open' | 'closed') => ticketApi.update(id, { status });
export const replyToTicket = (id: string, reply: string) => ticketApi.update(id, { reply, status: 'closed' });

// Premium Request API
export const getPremiumRequests = () => premiumRequestApi.getAll();
export const addPremiumRequest = (userId: number, userName: string, userTg: string) => {
    const newRequestData: Omit<PremiumRequest, 'id'> = { userId, userName, userTg, status: 'pending', timestamp: Date.now() };
    return premiumRequestApi.create(newRequestData);
};
export const approvePremiumRequest = async (userId: number) => {
    const reqs = await premiumRequestApi.getAll();
    const reqToUpdate = reqs.find(r => r.userId === userId && r.status === 'pending');
    if(reqToUpdate) {
        await premiumRequestApi.update(reqToUpdate.id, { status: 'approved' });
    }
    return updateUser({ id: userId, isPremium: true });
};

// Report API
export const getReports = () => reportApi.getAll();
export const addReport = (reportedId: number, reason: string, reporterId: number) => {
    const newReport: Omit<Report, 'id'> = { reportedId, reporterId, reason, status: 'open', timestamp: Date.now() };
    return reportApi.create(newReport);
};
export const resolveReport = (id: string) => reportApi.update(id, { status: 'resolved' });

// Age Verification API
export const getAgeVerificationRequests = () => ageVerificationRequestApi.getAll();
export const addAgeVerificationRequest = async (userId: number, userName: string, photoUrl: string) => {
    const newRequest: Omit<AgeVerificationRequest, 'id'> = { userId, userName, photoUrl, status: 'pending', timestamp: Date.now() };
    const createdReq = await ageVerificationRequestApi.create(newRequest);
    await updateUser({ id: userId, ageVerificationRequestId: createdReq.id });
    return createdReq;
};
export const handleAgeVerificationRequest = async (id: string, isApproved: boolean) => {
    const status = isApproved ? 'approved' : 'rejected';
    const request = await ageVerificationRequestApi.update(id, { status });
    if(request && isApproved) {
        await updateUser({ id: request.userId, isAgeVerified: true, ageVerificationRequestId: undefined });
    } else if (request) {
        await updateUser({ id: request.userId, ageVerificationRequestId: undefined });
    }
    return request!;
};

// Unban Request API
export const getUnbanRequests = () => unbanRequestApi.getAll();
export const addUnbanRequest = (userId: number, userName: string, reason: string) => {
    const newRequest: Omit<UnbanRequest, 'id'> = { userId, userName, reason, status: 'pending', timestamp: Date.now() };
    return unbanRequestApi.create(newRequest);
};
export const handleUnbanRequest = async (id: string, isApproved: boolean) => {
    const status = isApproved ? 'approved' : 'rejected';
    const request = await unbanRequestApi.update(id, { status });
    if(request && isApproved) {
        await updateUser({ id: request.userId, isBlocked: false, banReason: undefined });
    }
    return request!;
};


// Business Logic Helpers
export const getDistanceBetweenUsers = (user1: User, user2: User): number | null => {
    if (!user1.location || !user2.location) {
        return null;
    }
    return calculateDistance(user1.location.lat, user1.location.lon, user2.location.lat, user2.location.lon);
};