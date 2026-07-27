"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Phone, Mail, Calendar, User, FileText, CheckCircle2, XCircle, Clock, Save, X, Trash2, ArrowLeft, ChevronLeft, Plus, Edit, ChevronRight, AlertTriangle, Check, DollarSign, Lock, Upload, Eye, Sliders, Star, HelpCircle, BookOpen } from "lucide-react";
import { MOCK_LEADS } from "@/lib/crm/mock-data";
import { LEAD_STATUSES, Lead, LeadStatus, Task, TaskStatus, TASK_STATUSES, ResourceItem } from "@/lib/crm/types";
import { destinationsData, Destination } from "@/lib/destinations";
import { blogPosts, BlogPost } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

import { supabase } from "@/lib/supabase";
import { submitLead, deleteLead } from "@/app/actions";
const getLocalYYYYMMDD = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function AdminDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]); // Start empty
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [detailModalTab, setDetailModalTab] = useState<'info' | 'tasks'>('info');
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false); // New state for create modal
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<LeadStatus>("new"); // Mobile tab state

    type SortOption = 'created_at' | 'check_in' | 'probability';
    const [sortBy, setSortBy] = useState<SortOption>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    type AdminView = 'portal' | 'sales' | 'post-sales' | 'lost' | 'resources_config' | 'site_config' | 'help';
    const [view, setView] = useState<AdminView>('portal');
    const [activeHelpChapter, setActiveHelpChapter] = useState<'sales_strategy' | 'leads_pipeline' | 'tasks_org' | 'resources_center' | 'cms_editor'>('sales_strategy');

    const DEFAULT_RESOURCES: ResourceItem[] = [
        { id: 'wdw_mde', title: 'GUÍA MY DISNEY EXPERIENCE', category: 'wdw', pdf_url: null },
        { id: 'wdw_ll', title: 'GUÍA RESERVAS Lightning Lane', category: 'wdw', pdf_url: null },
        { id: 'wdw_overview', title: 'GUÍA Overview Disney World', category: 'wdw', pdf_url: null },
        { id: 'wdw_dining', title: 'Guía Dining Plan', category: 'wdw', pdf_url: null },
        { id: 'wdw_dining_char', title: 'Restaurantes - Experiencias con personajes', category: 'wdw', pdf_url: null },
        { id: 'wdw_dining_req', title: 'Restaurantes - Requieren reservacion', category: 'wdw', pdf_url: null },
        { id: 'dl_app', title: 'GUÍA Disneyland APP', category: 'dl', pdf_url: null },
        { id: 'dl_ll', title: 'GUÍA RESERVAS Lightning Lane', category: 'dl', pdf_url: null },
        { id: 'dl_overview', title: 'GUÍA Overview Disneyland', category: 'dl', pdf_url: null },
        { id: 'dl_dining_char', title: 'Restaurantes - Experiencias con personajes', category: 'dl', pdf_url: null },
        { id: 'dl_dining_req', title: 'Restaurantes - Requieren reservacion', category: 'dl', pdf_url: null },
        { id: 'dcl_overview', title: 'Overview', category: 'dcl', pdf_url: null },
        { id: 'dcl_deck', title: 'Deck Plan', category: 'dcl', pdf_url: null }
    ];

    const [resourcesList, setResourcesList] = useState<ResourceItem[]>([]);
    const [uploadingResourceId, setUploadingResourceId] = useState<string | null>(null);
    const [activeAddCategory, setActiveAddCategory] = useState<'wdw' | 'dl' | 'dcl' | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
    const [newResourceTitle, setNewResourceTitle] = useState("");
    const [newResourceFile, setNewResourceFile] = useState<File | null>(null);

    // CMS CONFIGURATION STATES
    // 1. Gallery
    interface GalleryItem {
        id: string;
        image_url: string;
        alt: string;
        sort_order?: number;
    }
    const DEFAULT_GALLERY: GalleryItem[] = [
        { id: "g1", image_url: "/images/gallery/1.jpg", alt: "Familia feliz en Magic Kingdom" },
        { id: "g2", image_url: "/images/gallery/2.jpg", alt: "Disfrutando Disney Cruise Line" },
        { id: "g3", image_url: "/images/gallery/3.jpg", alt: "Café temático Disney" },
        { id: "g4", image_url: "/images/gallery/4.jpg", alt: "Relax en la cubierta del crucero" },
        { id: "g5", image_url: "/images/gallery/5.jpg", alt: "Andy's Room en Disney's Oceaneer Club" },
        { id: "g6", image_url: "/images/gallery/6.jpg", alt: "Diversión en Andy's Room" },
        { id: "g7", image_url: "/images/gallery/7.jpg", alt: "Momentos inolvidables en familia" },
        { id: "g8", image_url: "/images/gallery/8.jpg", alt: "Noche mágica en Disney" },
    ];
    const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);
    
    // 2. Reviews
    interface ReviewItemCMS {
        id: number;
        name: string;
        role: string;
        content: string;
        rating: number;
        is_approved: boolean;
        image_url?: string | null;
        created_at?: string;
    }
    const [reviewsList, setReviewsList] = useState<ReviewItemCMS[]>([]);
    const [isSavingReview, setIsSavingReview] = useState(false);
    const [editingReview, setEditingReview] = useState<ReviewItemCMS | null>(null);
    const [isCreatingReview, setIsCreatingReview] = useState(false);
    
    // 3. About Me
    const [aboutMeData, setAboutMeData] = useState<Record<string, string>>({
        about_me_title: "¿Quién Soy?",
        about_me_greeting: "¡Hola! Soy Anna Karen.",
        about_me_role: "Creadora de Here We Go Advisor y Agente Certificada Disney.",
        about_me_paragraphs: JSON.stringify([
            "Mi amor por Disney comenzó desde pequeña, tuve la oportunidad de trabajar en Walt Disney World a través del programa Disney College Program. Ahí descubrí que lo que más disfruto es organizar, planear y ayudar a que cada familia viva su propia versión de la magia.",
            "Here We Go Advisor nació con una idea muy sencilla: la magia se disfruta más cuando la planeación no te quita tiempo, energía ni ilusión.",
            "Hoy me dedico a diseñar experiencias personalizadas para que tú solamente te preocupes por sonreír y crear recuerdos. Conozco los secretos que hacen la diferencia: desde el mejor lugar para ver los fuegos artificiales hasta esos detalles que elevan cualquier itinerario.",
            "No solo reservo viajes: transformo tus sueños Disney en momentos inolvidables."
        ]),
        about_me_quote: '"Here We Go Advisor nació con una idea muy sencilla: la magia se disfruta más cuando la planeación no te quita tiempo, energía ni ilusión."',
        about_me_image_grads: "/images/about-grads.jpg",
        about_me_image_solo: "/images/about-solo.jpg"
    });
    const [isSavingAboutMe, setIsSavingAboutMe] = useState(false);

    // 4. Destinations
    const [destinationsList, setDestinationsList] = useState<Destination[]>([]);
    const [isSavingDestination, setIsSavingDestination] = useState(false);
    const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
    const [isCreatingDestination, setIsCreatingDestination] = useState(false);

    // 5. Blog
    const [blogPostsList, setBlogPostsList] = useState<BlogPost[]>([]);
    const [isSavingBlogPost, setIsSavingBlogPost] = useState(false);
    const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
    const [isCreatingBlogPost, setIsCreatingBlogPost] = useState(false);

    // Sidebar active tab inside site_config
    const [activeConfigTab, setActiveConfigTab] = useState<'gallery' | 'reviews' | 'about' | 'destinations' | 'blog'>('gallery');

    const fetchCmsData = async () => {
        // 1. Gallery
        try {
            const { data } = await supabase.from('homepage_gallery').select('*').order('sort_order', { ascending: true });
            if (data && data.length > 0) {
                setGalleryList(data);
                localStorage.setItem('cms_gallery_fallback', JSON.stringify(data));
            } else {
                const local = localStorage.getItem('cms_gallery_fallback');
                const list = local ? JSON.parse(local) : DEFAULT_GALLERY;
                setGalleryList(list);
            }
        } catch (e) {
            const local = localStorage.getItem('cms_gallery_fallback');
            setGalleryList(local ? JSON.parse(local) : DEFAULT_GALLERY);
        }

        // 2. Reviews
        try {
            const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
            if (data && data.length > 0) {
                setReviewsList(data);
                localStorage.setItem('cms_reviews_fallback', JSON.stringify(data));
            } else {
                const local = localStorage.getItem('cms_reviews_fallback');
                const defaultRev = [
                    { id: 1, name: "María G.", role: "Mamá de 3", content: "¡Ana Karen hizo que nuestro viaje fuera perfecto! No tuvimos que preocuparnos por nada, solo disfrutar.", rating: 5, is_approved: true }
                ];
                setReviewsList(local ? JSON.parse(local) : defaultRev);
            }
        } catch (e) {
            const local = localStorage.getItem('cms_reviews_fallback');
            setReviewsList(local ? JSON.parse(local) : []);
        }

        // 3. About Me (Site Settings)
        try {
            const { data } = await supabase.from('site_settings').select('*');
            if (data && data.length > 0) {
                const settings: Record<string, string> = {};
                data.forEach(item => { settings[item.key] = item.value; });
                const merged = {
                    about_me_title: settings.about_me_title || "¿Quién Soy?",
                    about_me_greeting: settings.about_me_greeting || "¡Hola! Soy Anna Karen.",
                    about_me_role: settings.about_me_role || "Creadora de Here We Go Advisor y Agente Certificada Disney.",
                    about_me_paragraphs: settings.about_me_paragraphs || JSON.stringify([
                        "Mi amor por Disney comenzó desde pequeña, tuve la oportunidad de trabajar en Walt Disney World a través del programa Disney College Program. Ahí descubrí que lo que más disfruto es organizar, planear y ayudar a que cada familia viva su propia versión de la magia.",
                        "Here We Go Advisor nació con una idea muy sencilla: la magia se disfruta más cuando la planeación no te quita tiempo, energía ni ilusión.",
                        "Hoy me dedico a diseñar experiencias personalizadas para que tú solamente te preocupes por sonreír y crear recuerdos. Conozco los secretos que hacen la diferencia: desde el mejor lugar para ver los fuegos artificiales hasta esos detalles que elevan cualquier itinerario.",
                        "No solo reservo viajes: transformo tus sueños Disney en momentos inolvidables."
                    ]),
                    about_me_quote: settings.about_me_quote || '"Here We Go Advisor nació con una idea muy sencilla: la magia se disfruta más cuando la planeación no te quita tiempo, energía ni ilusión."',
                    about_me_image_grads: settings.about_me_image_grads || "/images/about-grads.jpg",
                    about_me_image_solo: settings.about_me_image_solo || "/images/about-solo.jpg"
                };
                setAboutMeData(merged);
                localStorage.setItem('cms_about_me_fallback', JSON.stringify(merged));
            } else {
                const local = localStorage.getItem('cms_about_me_fallback');
                if (local) setAboutMeData(JSON.parse(local));
            }
        } catch (e) {
            const local = localStorage.getItem('cms_about_me_fallback');
            if (local) setAboutMeData(JSON.parse(local));
        }

        // 4. Destinations
        try {
            const { data } = await supabase.from('destinations').select('*').order('title', { ascending: true });
            if (data && data.length > 0) {
                // Map db values highlights/must_dos/tips back to highlights/mustDos/tips camelCase properties
                const mapped = data.map(d => ({
                    slug: d.slug,
                    title: d.title,
                    subtitle: d.subtitle,
                    heroImage: d.hero_image,
                    overview: d.overview,
                    highlights: typeof d.highlights === 'string' ? JSON.parse(d.highlights) : d.highlights,
                    mustDos: typeof d.must_dos === 'string' ? JSON.parse(d.must_dos) : d.must_dos,
                    tips: typeof d.tips === 'string' ? JSON.parse(d.tips) : d.tips
                }));
                setDestinationsList(mapped);
                localStorage.setItem('cms_destinations_fallback', JSON.stringify(mapped));
            } else {
                const local = localStorage.getItem('cms_destinations_fallback');
                setDestinationsList(local ? JSON.parse(local) : Object.values(destinationsData));
            }
        } catch (e) {
            const local = localStorage.getItem('cms_destinations_fallback');
            setDestinationsList(local ? JSON.parse(local) : Object.values(destinationsData));
        }

        // 5. Blog Posts
        try {
            const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
            if (data && data.length > 0) {
                const mapped = data.map(p => ({
                    id: p.id,
                    slug: p.slug,
                    title: p.title,
                    excerpt: p.excerpt,
                    content: p.content,
                    date: p.date,
                    readTime: p.read_time,
                    image: p.image,
                    category: p.category
                }));
                setBlogPostsList(mapped);
                localStorage.setItem('cms_blog_posts_fallback', JSON.stringify(mapped));
            } else {
                const local = localStorage.getItem('cms_blog_posts_fallback');
                setBlogPostsList(local ? JSON.parse(local) : blogPosts);
            }
        } catch (e) {
            const local = localStorage.getItem('cms_blog_posts_fallback');
            setBlogPostsList(local ? JSON.parse(local) : blogPosts);
        }
    };

    const handleAddGalleryImage = async (file: File, alt: string) => {
        setIsUploadingGallery(true);
        const newId = `g_${Math.random().toString(36).substring(2, 9)}`;
        let imageUrl = "";

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${newId}_${Date.now()}.${fileExt}`;
            const { data } = await supabase.storage.from('gallery').upload(fileName, file);
            if (data) {
                const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName);
                imageUrl = publicUrl;
            }
        } catch (e) {
            console.error("Storage upload failed for gallery, trying base64 fallback", e);
        }

        const saveItem = async (imgUrlVal: string) => {
            const newItem = {
                id: newId,
                image_url: imgUrlVal,
                alt: alt || "Imagen de la galería",
                sort_order: galleryList.length
            };
            try {
                await supabase.from('homepage_gallery').insert([newItem]);
            } catch (e) {}
            
            setGalleryList(prev => {
                const updated = [...prev, newItem];
                localStorage.setItem('cms_gallery_fallback', JSON.stringify(updated));
                return updated;
            });
            alert("Imagen agregada a la galería.");
        };

        if (!imageUrl) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                saveItem(base64);
            };
            reader.readAsDataURL(file);
        } else {
            await saveItem(imageUrl);
        }
        setIsUploadingGallery(false);
    };

    const handleDeleteGalleryImage = async (id: string) => {
        if (!confirm("¿Deseas eliminar esta imagen de la galería?")) return;
        try {
            await supabase.from('homepage_gallery').delete().eq('id', id);
        } catch (e) {}

        setGalleryList(prev => {
            const updated = prev.filter(img => img.id !== id);
            localStorage.setItem('cms_gallery_fallback', JSON.stringify(updated));
            return updated;
        });
        alert("Imagen eliminada de la galería.");
    };

    const handleUpdateGalleryImageAlt = async (id: string, newAlt: string) => {
        try {
            await supabase.from('homepage_gallery').update({ alt: newAlt }).eq('id', id);
        } catch (e) {
            console.error("Error updating image alt in Supabase:", e);
        }

        setGalleryList(prev => {
            const updated = prev.map(img => img.id === id ? { ...img, alt: newAlt } : img);
            localStorage.setItem('cms_gallery_fallback', JSON.stringify(updated));
            return updated;
        });
        alert("Descripción de la imagen actualizada.");
    };

    const handleSaveReview = async (review: ReviewItemCMS) => {
        setIsSavingReview(true);
        try {
            if (review.id && review.id > 10) { 
                await supabase.from('reviews').upsert(review);
            } else {
                const { id, ...insertData } = review;
                await supabase.from('reviews').insert([insertData]);
            }
        } catch (e) {}
        
        await fetchCmsData();
        alert("Reseña guardada exitosamente.");
        setIsSavingReview(false);
    };

    const handleDeleteReview = async (id: number) => {
        if (!confirm("¿Deseas eliminar esta reseña?")) return;
        try {
            await supabase.from('reviews').delete().eq('id', id);
        } catch (e) {}

        setReviewsList(prev => {
            const updated = prev.filter(r => r.id !== id);
            localStorage.setItem('cms_reviews_fallback', JSON.stringify(updated));
            return updated;
        });
        alert("Reseña eliminada.");
    };

    const handleSaveAboutMe = async (data: Record<string, string>) => {
        setIsSavingAboutMe(true);
        try {
            const promises = Object.entries(data).map(([key, val]) => {
                return supabase.from('site_settings').upsert({ key, value: val });
            });
            await Promise.all(promises);
        } catch (e) {}

        setAboutMeData(data);
        localStorage.setItem('cms_about_me_fallback', JSON.stringify(data));
        alert("Configuración de 'Sobre Mí' guardada exitosamente.");
        setIsSavingAboutMe(false);
    };

    const handleSaveDestination = async (dest: Destination, heroFile: File | null) => {
        setIsSavingDestination(true);
        let finalHeroUrl = dest.heroImage;

        if (heroFile) {
            try {
                const fileExt = heroFile.name.split('.').pop();
                const fileName = `dest_${dest.slug}_${Date.now()}.${fileExt}`;
                const { data } = await supabase.storage.from('gallery').upload(fileName, heroFile);
                if (data) {
                    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(fileName);
                    finalHeroUrl = publicUrl;
                }
            } catch (e) {
                console.error("Failed to upload destination hero image", e);
            }
        }

        const updatedDest = {
            ...dest,
            heroImage: finalHeroUrl,
            updated_at: new Date().toISOString()
        };

        const dbData = {
            slug: updatedDest.slug,
            title: updatedDest.title,
            subtitle: updatedDest.subtitle,
            hero_image: updatedDest.heroImage,
            overview: updatedDest.overview,
            highlights: updatedDest.highlights,
            must_dos: updatedDest.mustDos,
            tips: updatedDest.tips,
            updated_at: updatedDest.updated_at
        };

        try {
            await supabase.from('destinations').upsert(dbData);
        } catch (e) {}

        setDestinationsList(prev => {
            const exists = prev.some(d => d.slug === dest.slug);
            const updated = exists 
                ? prev.map(d => d.slug === dest.slug ? updatedDest : d)
                : [...prev, updatedDest];
            localStorage.setItem('cms_destinations_fallback', JSON.stringify(updated));
            return updated;
        });
        
        alert("Destino guardado exitosamente.");
        setIsSavingDestination(false);
    };

    const handleDeleteDestination = async (slug: string) => {
        if (!confirm("¿Deseas eliminar este destino por completo?")) return;
        try {
            await supabase.from('destinations').delete().eq('slug', slug);
        } catch (e) {}

        setDestinationsList(prev => {
            const updated = prev.filter(d => d.slug !== slug);
            localStorage.setItem('cms_destinations_fallback', JSON.stringify(updated));
            return updated;
        });
        alert("Destino eliminado.");
    };

    const handleSaveBlogPost = async (post: BlogPost, imageFile: File | null) => {
        setIsSavingBlogPost(true);
        let finalImageUrl = post.image;

        if (imageFile) {
            try {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `blog_${post.slug}_${Date.now()}.${fileExt}`;
                const { data } = await supabase.storage.from('blog').upload(fileName, imageFile);
                if (data) {
                    const { data: { publicUrl } } = supabase.storage.from('blog').getPublicUrl(fileName);
                    finalImageUrl = publicUrl;
                }
            } catch (e) {
                console.error("Failed to upload blog header image", e);
            }
        }

        const updatedPost = {
            ...post,
            id: post.id || `b_${Math.random().toString(36).substring(2, 9)}`,
            image: finalImageUrl
        };

        const dbData = {
            id: updatedPost.id.startsWith('b_') ? undefined : updatedPost.id, // Generate new UUID on DB insert
            slug: updatedPost.slug,
            title: updatedPost.title,
            excerpt: updatedPost.excerpt,
            content: updatedPost.content,
            date: updatedPost.date,
            read_time: updatedPost.readTime,
            image: updatedPost.image,
            category: updatedPost.category,
            created_at: new Date().toISOString()
        };

        try {
            await supabase.from('blog_posts').upsert(dbData);
        } catch (e) {}

        await fetchCmsData();
        alert("Artículo de blog guardado exitosamente.");
        setIsSavingBlogPost(false);
    };

    const handleDeleteBlogPost = async (id: string) => {
        if (!confirm("¿Deseas eliminar este artículo de blog?")) return;
        try {
            await supabase.from('blog_posts').delete().eq('id', id);
        } catch (e) {}

        setBlogPostsList(prev => {
            const updated = prev.filter(p => p.id !== id);
            localStorage.setItem('cms_blog_posts_fallback', JSON.stringify(updated));
            return updated;
        });
        alert("Artículo de blog eliminado.");
    };

    const fetchAdminResources = async () => {
        let dbList: ResourceItem[] = [];
        try {
            const { data, error } = await supabase
                .from('resources')
                .select('*')
                .order('updated_at', { ascending: true });
            if (data && data.length > 0) {
                dbList = data as ResourceItem[];
            }
        } catch (e) {
            console.error("Failed to fetch admin resources:", e);
        }

        // Merge with local storage fallback
        let localList: ResourceItem[] = [];
        const local = localStorage.getItem('crm_resources_list_fallback');
        if (local) {
            try {
                localList = JSON.parse(local) as ResourceItem[];
            } catch (e) {}
        }

        const combined = [...dbList];
        localList.forEach(l => {
            if (!combined.some(c => c.id === l.id)) {
                combined.push(l);
            }
        });

        if (combined.length === 0) {
            setResourcesList(DEFAULT_RESOURCES);
            localStorage.setItem('crm_resources_list_fallback', JSON.stringify(DEFAULT_RESOURCES));
        } else {
            setResourcesList(combined);
        }
    };

    const handleAddResource = async (category: 'wdw' | 'dl' | 'dcl', title: string, file: File | null) => {
        const newId = `${category}_${Math.random().toString(36).substring(2, 9)}`;
        let pdfUrl = "";

        if (file) {
            setUploadingResourceId(newId);
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${newId}_${Date.now()}.${fileExt}`;
                const { data, error: uploadError } = await supabase.storage
                    .from('resources')
                    .upload(fileName, file);

                if (data) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('resources')
                        .getPublicUrl(fileName);
                    pdfUrl = publicUrl;
                }
            } catch (err) {
                console.error("Upload error:", err);
            } finally {
                setUploadingResourceId(null);
            }
        }

        const saveItem = async (urlVal: string | null) => {
            const newItem: ResourceItem = {
                id: newId,
                title,
                category,
                pdf_url: urlVal,
                updated_at: new Date().toISOString()
            };

            try {
                const { error } = await supabase
                    .from('resources')
                    .insert([newItem]);
                if (error) {
                    console.warn("DB insert failed, using fallback.", error);
                }
            } catch (e) {}

            setResourcesList(prev => {
                const updated = [...prev, newItem];
                localStorage.setItem('crm_resources_list_fallback', JSON.stringify(updated));
                return updated;
            });
            alert("Guía agregada exitosamente.");
            fetchAdminResources();
        };

        if (file && !pdfUrl) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                saveItem(base64);
            };
            reader.readAsDataURL(file);
        } else {
            saveItem(pdfUrl || null);
        }
    };

    const handleUploadResource = async (resourceId: string, file: File) => {
        setUploadingResourceId(resourceId);
        try {
            let publicUrl = "";
            const fileExt = file.name.split('.').pop();
            const fileName = `${resourceId}_${Date.now()}.${fileExt}`;
            
            const { data, error: uploadError } = await supabase.storage
                .from('resources')
                .upload(fileName, file);

            if (uploadError && !uploadError.message?.includes("already exists")) {
                console.warn("Storage upload failed, attempting fallback to local Base64.", uploadError);
            } else if (data) {
                const { data: { publicUrl: url } } = supabase.storage
                    .from('resources')
                    .getPublicUrl(fileName);
                publicUrl = url;
            }

            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64 = e.target?.result as string;
                const finalUrl = publicUrl || base64;

                try {
                    const existingItem = resourcesList.find(r => r.id === resourceId);
                    const upsertData = {
                        id: resourceId,
                        title: existingItem?.title || "Guía",
                        category: existingItem?.category || "wdw",
                        pdf_url: finalUrl,
                        updated_at: new Date().toISOString()
                    };
                    await supabase
                        .from('resources')
                        .upsert(upsertData);
                } catch (dbErr) {
                    console.error("Database upsert failed:", dbErr);
                }

                setResourcesList(prev => {
                    const updated = prev.map(item => 
                        item.id === resourceId ? { ...item, pdf_url: finalUrl, updated_at: new Date().toISOString() } : item
                    );
                    localStorage.setItem('crm_resources_list_fallback', JSON.stringify(updated));
                    return updated;
                });

                alert("Archivo PDF cargado exitosamente.");
            };
            reader.readAsDataURL(file);

        } catch (error) {
            console.error("Upload failed:", error);
            alert("Error al subir el archivo.");
        } finally {
            setUploadingResourceId(null);
        }
    };

    const handleDeleteResource = async (resourceId: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta guía por completo?")) return;
        
        try {
            const { error } = await supabase
                .from('resources')
                .delete()
                .eq('id', resourceId);
            if (error) {
                console.warn("DB delete failed, using local fallback", error);
            }
        } catch (e) {}

        setResourcesList(prev => {
            const updated = prev.filter(item => item.id !== resourceId);
            localStorage.setItem('crm_resources_list_fallback', JSON.stringify(updated));
            return updated;
        });
        alert("Guía eliminada exitosamente.");
    };


    // Tareas (Follow-up Tasks) states
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLocalTasksFallback, setIsLocalTasksFallback] = useState(false);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
    const [taskActiveTab, setTaskActiveTab] = useState<'overdue' | 'today' | 'upcoming' | 'selected'>('today');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
    const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
    const [statsYear, setStatsYear] = useState<string>('all');
    const [statsMonth, setStatsMonth] = useState<string>('all');

    const handlePrevMonth = () => {
        setCalendarMonth(prev => {
            if (prev === 0) {
                setCalendarYear(y => y - 1);
                return 11;
            }
            return prev - 1;
        });
    };

    const handleNextMonth = () => {
        setCalendarMonth(prev => {
            if (prev === 11) {
                setCalendarYear(y => y + 1);
                return 0;
            }
            return prev + 1;
        });
    };

    const fetchTasks = async () => {
        try {
            setTasksLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('due_date', { ascending: true });

            if (error) {
                if (error.code === 'PGRST205' || error.message?.includes('relation "public.tasks" does not exist') || error.message?.includes('does not exist')) {
                    console.warn("Supabase tasks table not found, falling back to localStorage.");
                    setIsLocalTasksFallback(true);
                    const stored = localStorage.getItem('crm_tasks_fallback');
                    if (stored) {
                        setTasks(JSON.parse(stored));
                    }
                } else {
                    console.error("Error fetching tasks:", error);
                }
            } else if (data) {
                setTasks(data as Task[]);
            }
        } catch (e) {
            console.error("Failed to fetch tasks from Supabase:", e);
            setIsLocalTasksFallback(true);
            const stored = localStorage.getItem('crm_tasks_fallback');
            if (stored) {
                setTasks(JSON.parse(stored));
            }
        } finally {
            setTasksLoading(false);
        }
    };

    const handleCreateTask = async (taskData: Omit<Task, 'id' | 'created_at'>) => {
        const tempId = Math.random().toString(36).substring(2, 9);
        const newTask: Task = {
            id: tempId,
            created_at: new Date().toISOString(),
            ...taskData
        };

        // Optimistic update
        setTasks(prev => {
            const updated = [...prev, newTask];
            if (isLocalTasksFallback) {
                localStorage.setItem('crm_tasks_fallback', JSON.stringify(updated));
            }
            return updated;
        });

        if (!isLocalTasksFallback) {
            const { data, error } = await supabase
                .from('tasks')
                .insert([taskData])
                .select()
                .single();

            if (error) {
                console.error("Error creating task in DB:", error);
                if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
                    setIsLocalTasksFallback(true);
                    setTasks(prev => {
                        const updated = prev.map(t => t.id === tempId ? newTask : t);
                        localStorage.setItem('crm_tasks_fallback', JSON.stringify(updated));
                        return updated;
                    });
                } else {
                    alert(`Error al crear la tarea: ${error.message}`);
                    fetchTasks();
                }
            } else if (data) {
                setTasks(prev => prev.map(t => t.id === tempId ? (data as Task) : t));
            }
        }
    };

    const handleUpdateTask = async (taskId: string, updatedFields: Partial<Omit<Task, 'id' | 'created_at'>>) => {
        // Optimistic update
        setTasks(prev => {
            const updated = prev.map(t => t.id === taskId ? { ...t, ...updatedFields } : t);
            if (isLocalTasksFallback) {
                localStorage.setItem('crm_tasks_fallback', JSON.stringify(updated));
            }
            return updated;
        });

        if (!isLocalTasksFallback) {
            const { error } = await supabase
                .from('tasks')
                .update(updatedFields)
                .eq('id', taskId);

            if (error) {
                console.error("Error updating task in DB:", error);
                if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
                    setIsLocalTasksFallback(true);
                    setTasks(prev => {
                        const updated = prev.map(t => t.id === taskId ? { ...t, ...updatedFields } : t);
                        localStorage.setItem('crm_tasks_fallback', JSON.stringify(updated));
                        return updated;
                    });
                } else {
                    alert(`Error al actualizar la tarea: ${error.message}`);
                    fetchTasks();
                }
            }
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
            return;
        }

        // Optimistic update
        setTasks(prev => {
            const updated = prev.filter(t => t.id !== taskId);
            if (isLocalTasksFallback) {
                localStorage.setItem('crm_tasks_fallback', JSON.stringify(updated));
            }
            return updated;
        });

        if (!isLocalTasksFallback) {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);

            if (error) {
                console.error("Error deleting task in DB:", error);
                if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
                    setIsLocalTasksFallback(true);
                    setTasks(prev => {
                        const updated = prev.filter(t => t.id !== taskId);
                        localStorage.setItem('crm_tasks_fallback', JSON.stringify(updated));
                        return updated;
                    });
                } else {
                    alert(`Error al eliminar la tarea: ${error.message}`);
                    fetchTasks();
                }
            }
        }
    };

    const handleExportCSV = () => {
        let headers: string[] = [];
        let rows: any[][] = [];
        let filename = "leads";

        const filteredLeads = leads.filter(l => {
            if (view === 'sales') return ['new', 'contacted', 'proposal'].includes(l.status);
            if (view === 'post-sales') return ['won', 'reservation_60_plus', 'reservation_60_minus', 'disney_reserved', 'trip_completed'].includes(l.status);
            if (view === 'lost') return l.status === 'lost';
            return true;
        });

        if (view === 'sales') {
            headers = [
                "ID", "Fecha de Registro", "Cliente", "Email", "Teléfono", "Destino", 
                "Check-In", "Check-Out", "Viajeros", "Etapa", "Probabilidad (%)", 
                "Monto Estimado", "Notas"
            ];
            rows = filteredLeads.map(l => [
                l.id,
                new Date(l.created_at).toLocaleString(),
                l.client_name,
                l.email,
                l.phone,
                l.destination,
                l.check_in || '',
                l.check_out || '',
                l.travelers,
                l.status,
                l.probability !== undefined && l.probability !== null ? `${l.probability}` : '',
                l.estimated_sale_amount || 0,
                l.notes || ''
            ]);
            filename = `leads_ventas_${new Date().toISOString().slice(0,10)}`;
        } else if (view === 'post-sales') {
            headers = [
                "ID", "Fecha de Registro", "Cliente", "Email", "Teléfono", "Destino", 
                "Check-In", "Check-Out", "Viajeros", "Etapa", "Clasificación Proveedor", 
                "Precio Final", "Comisión", "Status de Pago", "Booking/Reference", 
                "Fecha de Envío Cotización", "Monto Estimado", "Notas del Cliente", "Notas del Admin"
            ];
            rows = filteredLeads.map(l => [
                l.id,
                new Date(l.created_at).toLocaleString(),
                l.client_name,
                l.email,
                l.phone,
                l.destination,
                l.check_in || '',
                l.check_out || '',
                l.travelers,
                l.status,
                l.provider_classification || '',
                l.price || 0,
                l.commission || 0,
                l.payment_status || '',
                l.booking_reference || '',
                l.quote_sent_date || '',
                l.estimated_sale_amount || 0,
                l.notes || '',
                l.admin_notes || ''
            ]);
            filename = `leads_postventa_${new Date().toISOString().slice(0,10)}`;
        } else {
            headers = [
                "ID", "Fecha de Registro", "Cliente", "Email", "Teléfono", "Destino", 
                "Viajeros", "Notas del Cliente", "Notas del Admin"
            ];
            rows = filteredLeads.map(l => [
                l.id,
                new Date(l.created_at).toLocaleString(),
                l.client_name,
                l.email,
                l.phone,
                l.destination,
                l.travelers,
                l.notes || '',
                l.admin_notes || ''
            ]);
            filename = `leads_perdidos_${new Date().toISOString().slice(0,10)}`;
        }
        
        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Fetch real data on mount

    const autoClassifyStatus = (
        currentStatus: LeadStatus, 
        checkInDate: string | null | undefined,
        bookingRef: string | null | undefined
    ): LeadStatus => {
        const postSalesStatuses: LeadStatus[] = ['won', 'reservation_60_plus', 'reservation_60_minus', 'disney_reserved', 'trip_completed'];
        if (!postSalesStatuses.includes(currentStatus)) return currentStatus;

        const todayStr = getLocalYYYYMMDD();

        // Rule 1: If check-in date is in the past, it always goes to trip_completed
        if (checkInDate && checkInDate < todayStr) {
            return 'trip_completed';
        }

        // Rule 2: If there is a booking reference, it goes to disney_reserved
        const hasBookingRef = bookingRef && bookingRef.trim() !== '';
        if (hasBookingRef) {
            return 'disney_reserved';
        }

        // Rule 3: Otherwise, base it on the check-in date difference
        if (checkInDate) {
            const todayTime = new Date(todayStr + 'T00:00:00').getTime();
            const checkInTime = new Date(checkInDate + 'T00:00:00').getTime();
            const diffTime = checkInTime - todayTime;
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 60) {
                return 'reservation_60_minus';
            } else {
                return 'reservation_60_plus';
            }
        }

        return currentStatus;
    };

    useEffect(() => {
        fetchLeads();
        fetchTasks();
        fetchAdminResources();
        fetchCmsData();
    }, []);

    useEffect(() => {
        const todayStr = getLocalYYYYMMDD();
        const overdueCount = tasks.filter(t => t.due_date < todayStr && t.status !== 'completed').length;
        if (overdueCount > 0) {
            setTaskActiveTab('overdue');
        } else {
            setTaskActiveTab('today');
        }
    }, [tasks]);

    useEffect(() => {
        if (!selectedLead) {
            setDetailModalTab('info');
            setIsEditing(false);
        }
    }, [selectedLead]);

    const fetchLeads = async () => {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            const typedData = data.map(d => {
                const lead = { ...d, status: d.status as LeadStatus };
                const targetStatus = autoClassifyStatus(lead.status, lead.check_in, lead.booking_reference);

                if (targetStatus !== lead.status) {
                    supabase.from('leads').update({ status: targetStatus }).eq('id', lead.id)
                        .then(({ error }) => {
                            if (error) console.error(`Error updating auto-classified lead status:`, error);
                        });
                    lead.status = targetStatus;
                }
                return lead;
            });
            setLeads(typedData);
        }
        setIsLoading(false);
    };


    // Filter and Sort leads
    const filteredAndSortedLeads = [...leads]
        .filter(lead =>
            (lead.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'created_at') {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                comparison = (isNaN(dateA) ? 0 : dateA) - (isNaN(dateB) ? 0 : dateB);
            } else if (sortBy === 'check_in') {
                const dateA = a.check_in ? new Date(a.check_in).getTime() : 0;
                const dateB = b.check_in ? new Date(b.check_in).getTime() : 0;
                comparison = (isNaN(dateA) ? 0 : dateA) - (isNaN(dateB) ? 0 : dateB);
            } else if (sortBy === 'probability') {
                const probA = a.probability || 0;
                const probB = b.probability || 0;
                comparison = probA - probB;
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });

    // Set a default mobile activeTab when view changes
    useEffect(() => {
        if (view === 'sales') {
            setActiveTab('new');
        } else if (view === 'post-sales') {
            setActiveTab('won');
        } else if (view === 'lost') {
            setActiveTab('lost');
        }
    }, [view]);

    // Group by status, filtering statuses depending on active view
    const activeStatuses = 
        view === 'sales' 
            ? LEAD_STATUSES.filter(s => ['new', 'contacted', 'proposal'].includes(s.value))
            : view === 'post-sales'
                ? LEAD_STATUSES.filter(s => ['won', 'reservation_60_plus', 'reservation_60_minus', 'disney_reserved', 'trip_completed'].includes(s.value))
                : LEAD_STATUSES.filter(s => s.value === 'lost');

    const leadsByStatus = activeStatuses.map(status => {
        let items = filteredAndSortedLeads.filter(l => l.status === status.value);
        if (view === 'post-sales') {
            const todayTime = new Date(getLocalYYYYMMDD() + 'T00:00:00').getTime();
            items = [...items].sort((a, b) => {
                if (!a.check_in && !b.check_in) return 0;
                if (!a.check_in) return 1;
                if (!b.check_in) return -1;

                const timeA = new Date(a.check_in + 'T00:00:00').getTime();
                const timeB = new Date(b.check_in + 'T00:00:00').getTime();
                const diffA = isNaN(timeA) ? Infinity : Math.abs(timeA - todayTime);
                const diffB = isNaN(timeB) ? Infinity : Math.abs(timeB - todayTime);
                return diffA - diffB;
            });
        }
        return {
            ...status,
            items
        };
    });

    const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
        const lead = leads.find(l => l.id === leadId);
        const statusToApply = autoClassifyStatus(newStatus, lead?.check_in, lead?.booking_reference);

        // Optimistic update
        setLeads(leads.map(lead =>
            lead.id === leadId ? { ...lead, status: statusToApply } : lead
        ));
        if (selectedLead && selectedLead.id === leadId) {
            setSelectedLead({ ...selectedLead, status: statusToApply });
        }

        // Update in DB
        const { error } = await supabase.from('leads').update({ status: statusToApply }).eq('id', leadId);
        if (error) {
            console.error("Error al actualizar estado del lead:", error);
            alert(`Error al actualizar el estado: ${error.message}`);
            fetchLeads();
        }
    };

    const handleSaveNotes = async (leadId: string, newNotes: string) => {
        // Optimistic update
        setLeads(leads.map(lead =>
            lead.id === leadId ? { ...lead, admin_notes: newNotes } : lead
        ));
        if (selectedLead && selectedLead.id === leadId) {
            setSelectedLead({ ...selectedLead, admin_notes: newNotes });
        }
        setIsEditing(false);

        // Update in DB
        const { error } = await supabase.from('leads').update({ admin_notes: newNotes }).eq('id', leadId);
        if (error) {
            console.error("Error al guardar notas:", error);
            alert(`Error al guardar notas: ${error.message}`);
            fetchLeads();
        }
    }

    const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedLead) return;

        const formData = new FormData(e.currentTarget);
        const check_in = formData.get('check_in') as string;
        const check_out = formData.get('check_out') as string;
        const booking_reference = formData.get('booking_reference') as string;

        let statusInput = formData.get('status') as LeadStatus;
        const statusToApply = autoClassifyStatus(statusInput, check_in, booking_reference);

        const updatedFields = {
            client_name: formData.get('client_name') as string,
            email: (formData.get('email') as string)?.trim(),
            phone: formData.get('phone') as string,
            destination: formData.get('destination') as string,
            dates: check_in && check_out ? `In: ${check_in} | Out: ${check_out}` : (selectedLead.dates || ''),
            check_in: check_in || null,
            check_out: check_out || null,
            travelers: formData.get('travelers') as string,
            notes: formData.get('notes') as string,
            admin_notes: formData.get('admin_notes') as string,
            probability: formData.get('probability') ? parseInt(formData.get('probability') as string) : null,
            provider_classification: formData.get('provider_classification') as string || null,
            price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
            commission: formData.get('commission') ? parseFloat(formData.get('commission') as string) : null,
            payment_status: formData.get('payment_status') as string || null,
            booking_reference: booking_reference || null,
            quote_sent_date: formData.get('quote_sent_date') ? formData.get('quote_sent_date') as string : null,
            estimated_sale_amount: formData.get('estimated_sale_amount') ? parseFloat(formData.get('estimated_sale_amount') as string) : null,
            status: statusToApply,
            resource_access_enabled: formData.get('resource_access_enabled') === 'on',
            resource_pin: formData.get('resource_pin') as string || null,
            resource_wdw: formData.get('resource_wdw') === 'on',
            resource_dl: formData.get('resource_dl') === 'on',
            resource_dcl: formData.get('resource_dcl') === 'on',
        };

        const updatedLead = { ...selectedLead, ...updatedFields };

        // Optimistic update
        setLeads(leads.map(l => l.id === selectedLead.id ? updatedLead : l));
        setSelectedLead(updatedLead);
        setIsEditing(false);

        // Update in DB
        const { error } = await supabase
            .from('leads')
            .update(updatedFields)
            .eq('id', selectedLead.id);

        if (error) {
            console.error("Error al actualizar lead:", error);
            alert(`Error al actualizar el lead en la base de datos: ${error.message}`);
            fetchLeads(); // Revert on error
        }
    };

    const handleDeleteLead = async (leadId: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este lead? Esta acción no se puede deshacer.")) {
            return;
        }

        // Optimistic delete
        setLeads(leads.filter(l => l.id !== leadId));
        setSelectedLead(null);

        // Delete via Server Action
        const result = await deleteLead(leadId);

        if (!result.success) {
            alert("Error al eliminar el lead");
            fetchLeads(); // Revert on error
        }
    };


    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as LeadStatus;
        handleUpdateStatus(draggableId, newStatus);
    };

    const handleCreateLead = async (formData: FormData) => {
        const check_in = formData.get('check_in') as string;
        const check_out = formData.get('check_out') as string;
        const newLead = {
            client_name: formData.get('client_name') as string,
            email: (formData.get('email') as string)?.trim(),
            phone: formData.get('phone') as string,
            destination: formData.get('destination') as string,
            dates: check_in && check_out ? `In: ${check_in} | Out: ${check_out}` : '',
            check_in: check_in || null,
            check_out: check_out || null,
            travelers: formData.get('travelers') as string,
            notes: formData.get('notes') as string,
            status: 'new' as LeadStatus,
            probability: formData.get('probability') ? parseInt(formData.get('probability') as string) : null,
            provider_classification: formData.get('provider_classification') as string || null,
            price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
            commission: formData.get('commission') ? parseFloat(formData.get('commission') as string) : null,
            payment_status: formData.get('payment_status') as string || null,
            booking_reference: formData.get('booking_reference') as string || null,
            quote_sent_date: formData.get('quote_sent_date') ? formData.get('quote_sent_date') as string : null,
            estimated_sale_amount: formData.get('estimated_sale_amount') ? parseFloat(formData.get('estimated_sale_amount') as string) : null,
        };

        const { data, error } = await supabase
            .from('leads')
            .insert([newLead])
            .select()
            .single();

        if (data) {
            const typedLead = { ...data, status: data.status as LeadStatus };
            setLeads([typedLead, ...leads]);
            setIsCreating(false);
        } else {
            alert('Error al crear lead');
            console.error(error);
        }
    };

    // Statistical calculations for Portal Home
    const stats = {
        new: leads.filter(l => l.status === 'new').length,
        contacted: leads.filter(l => l.status === 'contacted').length,
        proposal: leads.filter(l => l.status === 'proposal').length,
        won: leads.filter(l => l.status === 'won').length,
        reservation_60_plus: leads.filter(l => l.status === 'reservation_60_plus').length,
        reservation_60_minus: leads.filter(l => l.status === 'reservation_60_minus').length,
        disney_reserved: leads.filter(l => l.status === 'disney_reserved').length,
        trip_completed: leads.filter(l => l.status === 'trip_completed').length,
        lost: leads.filter(l => l.status === 'lost').length,
    };

    // Filter leads for statistical calculations based on statsYear and statsMonth
    const statsFilteredLeads = leads.filter(l => {
        if (!l.created_at) return false;
        const leadDate = new Date(l.created_at);
        const leadYear = leadDate.getFullYear().toString();
        const leadMonth = leadDate.getMonth().toString(); // 0-indexed

        if (statsYear !== 'all' && leadYear !== statsYear) return false;
        if (statsMonth !== 'all' && leadMonth !== statsMonth) return false;

        return true;
    });

    const totalCotizado = statsFilteredLeads
        .filter(l => l.status === 'proposal')
        .reduce((sum, l) => sum + (l.estimated_sale_amount || l.price || 0), 0);

    const totalGanado = statsFilteredLeads
        .filter(l => ['won', 'reservation_60_plus', 'reservation_60_minus', 'disney_reserved', 'trip_completed'].includes(l.status))
        .reduce((sum, l) => sum + (l.price || l.estimated_sale_amount || 0), 0);

    const totalComision = statsFilteredLeads
        .filter(l => ['won', 'reservation_60_plus', 'reservation_60_minus', 'disney_reserved', 'trip_completed'].includes(l.status))
        .reduce((sum, l) => sum + (l.commission || 0), 0);

    // Extract unique years from all leads for dropdown options
    const availableYears = Array.from(new Set(leads.map(l => {
        if (!l.created_at) return null;
        return new Date(l.created_at).getFullYear().toString();
    }).filter(Boolean) as string[])).sort((a, b) => b.localeCompare(a));

    const yearsToDisplay = availableYears.length > 0 ? availableYears : [new Date().getFullYear().toString()];

    const MONTHS = [
        { value: '0', label: 'Enero' },
        { value: '1', label: 'Febrero' },
        { value: '2', label: 'Marzo' },
        { value: '3', label: 'Abril' },
        { value: '4', label: 'Mayo' },
        { value: '5', label: 'Junio' },
        { value: '6', label: 'Julio' },
        { value: '7', label: 'Agosto' },
        { value: '8', label: 'Septiembre' },
        { value: '9', label: 'Octubre' },
        { value: '10', label: 'Noviembre' },
        { value: '11', label: 'Diciembre' },
    ];

    const urgentLeads = leads.filter(l => {
        if (!l.check_in || l.status === 'lost') return false;
        
        const todayStr = getLocalYYYYMMDD();
        if (l.check_in < todayStr) return false;
        
        const todayTime = new Date(todayStr + 'T00:00:00').getTime();
        const checkInTime = new Date(l.check_in + 'T00:00:00').getTime();
        const diffTime = checkInTime - todayTime;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        
        const hasBookingRef = l.booking_reference && l.booking_reference.trim() !== '';
        
        return diffDays <= 60 && !hasBookingRef;
    }).sort((a, b) => {
        if (!a.check_in || !b.check_in) return 0;
        return a.check_in.localeCompare(b.check_in);
    });

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando CRM...</div>
    }

    return (
        <div className="p-6 md:p-10 pt-32 md:pt-36 max-w-[1600px] mx-auto text-sm">
            {view === 'portal' ? (
                /* Portal Home Dashboard View */
                <div className="space-y-10">
                    {/* Header Welcome Card */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 p-8 rounded-3xl border border-gray-100 backdrop-blur-md shadow-sm">
                        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                        <div className="absolute left-1/3 bottom-0 translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
                        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Portal de Administración</h1>
                                <p className="text-gray-500 mt-1.5 text-base">Resumen general de tus prospectos, cotizaciones y ventas de viaje.</p>
                            </div>
                            <div className="flex flex-wrap gap-3 shrink-0 self-start md:self-auto">
                                <button
                                    onClick={() => setView('help')}
                                    className="px-5 py-3 bg-white hover:bg-slate-50 border border-gray-200 text-gray-750 font-bold rounded-full transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                                >
                                    <HelpCircle className="h-4 w-4 text-primary" /> Ayuda & Manual
                                </button>
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md"
                                >
                                    <span className="text-xl leading-none font-bold">+</span> Crear Lead Manual
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Period filter for statistics */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-gray-900">📊 Rendimiento y Ventas</span>
                            <span className="text-xs text-gray-400 font-medium">Filtrado por fecha de creación del lead</span>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={statsYear}
                                onChange={(e) => setStatsYear(e.target.value)}
                                className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
                            >
                                <option value="all">Todos los años</option>
                                {yearsToDisplay.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <select
                                value={statsMonth}
                                onChange={(e) => setStatsMonth(e.target.value)}
                                className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
                            >
                                <option value="all">Todos los meses</option>
                                {MONTHS.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Top Statistics Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Quoted Cards */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg border border-purple-500/20 group hover:shadow-xl transition-all">
                            <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-semibold tracking-wide text-purple-100 uppercase">Venta Cotizada (Activa)</p>
                                    <h2 className="text-3xl lg:text-4xl font-black mt-2 tracking-tight">
                                        ${totalCotizado.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg font-bold text-purple-200">USD</span>
                                    </h2>
                                    <p className="text-xs text-purple-200 mt-2">Suma total estimada en etapa de "Cotización Enviada"</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Won Cards */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl text-white shadow-lg border border-emerald-500/20 group hover:shadow-xl transition-all">
                            <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-semibold tracking-wide text-emerald-100 uppercase">Ventas Ganadas / Logrado</p>
                                    <h2 className="text-3xl lg:text-4xl font-black mt-2 tracking-tight">
                                        ${totalGanado.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg font-bold text-emerald-200">USD</span>
                                    </h2>
                                    <p className="text-xs text-emerald-200 mt-2">Suma de precios finales en etapas ganadas y post-venta</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Commission Cards */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-rose-600 p-6 rounded-3xl text-white shadow-lg border border-amber-500/20 group hover:shadow-xl transition-all">
                            <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-semibold tracking-wide text-amber-100 uppercase">Comisiones Generadas</p>
                                    <h2 className="text-3xl lg:text-4xl font-black mt-2 tracking-tight">
                                        ${totalComision.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg font-bold text-amber-200">USD</span>
                                    </h2>
                                    <p className="text-xs text-amber-200 mt-2">Suma de comisiones logradas en etapas de post-venta</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tareas y Agenda de Seguimiento */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-5 tracking-tight uppercase flex items-center gap-2">
                            <span>📅</span> Agenda de Seguimiento y Tareas
                            {isLocalTasksFallback && (
                                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full lowercase normal-case font-medium">
                                    modo local (sin persistencia en bd)
                                </span>
                            )}
                        </h2>
                        
                        <div className="grid lg:grid-cols-5 gap-6">
                            {/* Calendario (col-span-2) */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-gray-905 text-sm tracking-tight capitalize">
                                            {new Date(calendarYear, calendarMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                        </h3>
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={handlePrevMonth} 
                                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                                type="button"
                                            >
                                                <ChevronLeft className="h-4 w-4 text-gray-600" />
                                            </button>
                                            <button 
                                                onClick={handleNextMonth} 
                                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                                type="button"
                                            >
                                                <ChevronRight className="h-4 w-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                                        <div>Dom</div>
                                        <div>Lun</div>
                                        <div>Mar</div>
                                        <div>Mié</div>
                                        <div>Jue</div>
                                        <div>Vie</div>
                                        <div>Sáb</div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-1">
                                        {(() => {
                                            const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
                                            const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
                                            
                                            const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
                                            const firstDayIndex = getFirstDayOfMonth(calendarMonth, calendarYear);
                                            const cells: { dateStr: string | null; dayNum: number | null }[] = [];
                                            
                                            for (let i = 0; i < firstDayIndex; i++) {
                                                cells.push({ dateStr: null, dayNum: null });
                                            }
                                            for (let day = 1; day <= daysInMonth; day++) {
                                                const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                cells.push({ dateStr, dayNum: day });
                                            }
                                            const totalCells = Math.ceil(cells.length / 7) * 7;
                                            const remaining = totalCells - cells.length;
                                            for (let i = 0; i < remaining; i++) {
                                                cells.push({ dateStr: null, dayNum: null });
                                            }

                                            return cells.map((cell, index) => {
                                                if (!cell.dayNum) {
                                                    return <div key={`empty-${index}`} className="aspect-square bg-gray-50/20 rounded-xl" />;
                                                }

                                                const dateStr = cell.dateStr!;
                                                const isSelected = selectedCalendarDate === dateStr;
                                                const isToday = dateStr === getLocalYYYYMMDD();
                                                const dayTasks = tasks.filter(t => t.due_date === dateStr);
                                                
                                                let dayStatus = null;
                                                if (dayTasks.length > 0) {
                                                    const todayStr = getLocalYYYYMMDD();
                                                    const hasOverdue = dayTasks.some(t => t.due_date < todayStr && t.status !== 'completed');
                                                    const hasPending = dayTasks.some(t => t.status !== 'completed');
                                                    dayStatus = hasOverdue ? 'overdue' : hasPending ? 'pending' : 'completed';
                                                }

                                                return (
                                                    <button
                                                        key={dateStr}
                                                        onClick={() => {
                                                            setSelectedCalendarDate(dateStr);
                                                            setTaskActiveTab('selected');
                                                        }}
                                                        type="button"
                                                        className={cn(
                                                            "aspect-square rounded-xl flex flex-col items-center justify-between p-1 transition-all relative border",
                                                            isSelected 
                                                                ? "bg-primary text-white border-primary shadow-sm" 
                                                                : isToday
                                                                    ? "bg-primary/5 text-primary border-primary/20 font-bold"
                                                                    : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                                                        )}
                                                    >
                                                        <span className="text-[10px] font-semibold">{cell.dayNum}</span>
                                                        {dayTasks.length > 0 && (
                                                            <span className={cn(
                                                                "text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0 min-w-[15px] text-center mt-1 scale-90",
                                                                isSelected
                                                                    ? "bg-white text-primary"
                                                                    : dayStatus === 'overdue'
                                                                        ? "bg-red-100 text-red-700"
                                                                        : dayStatus === 'pending'
                                                                            ? "bg-amber-100 text-amber-700"
                                                                            : "bg-green-100 text-green-700"
                                                            )}>
                                                                {dayTasks.length}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            });
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Panel de Tareas (col-span-3) */}
                            <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col min-h-[350px]">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900">Tareas Pendientes</h3>
                                        <p className="text-gray-500 text-xs mt-0.5">Seguimiento de prospectos agrupado por prioridad.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingTask(null);
                                            setIsCreatingTask(true);
                                        }}
                                        type="button"
                                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 shadow-sm self-start sm:self-auto"
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Nueva Tarea
                                    </button>
                                </div>

                                {/* Tabs */}
                                <div className="flex border-b border-gray-100 gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                                    {(() => {
                                        const todayStr = getLocalYYYYMMDD();
                                        const overdueTasks = tasks.filter(t => t.due_date < todayStr && t.status !== 'completed');
                                        const todayTasks = tasks.filter(t => t.due_date === todayStr);
                                        const upcomingTasks = tasks.filter(t => t.due_date > todayStr);
                                        const selectedTasks = selectedCalendarDate ? tasks.filter(t => t.due_date === selectedCalendarDate) : [];

                                        return (
                                            <>
                                                <button
                                                    onClick={() => setTaskActiveTab('overdue')}
                                                    type="button"
                                                    className={cn(
                                                        "pb-2 text-xs font-bold border-b-2 px-2 transition-all whitespace-nowrap",
                                                        taskActiveTab === 'overdue'
                                                            ? "border-red-500 text-red-600"
                                                            : "border-transparent text-gray-455 hover:text-gray-600"
                                                    )}
                                                >
                                                    Vencidas ({overdueTasks.length})
                                                </button>
                                                <button
                                                    onClick={() => setTaskActiveTab('today')}
                                                    type="button"
                                                    className={cn(
                                                        "pb-2 text-xs font-bold border-b-2 px-2 transition-all whitespace-nowrap",
                                                        taskActiveTab === 'today'
                                                            ? "border-primary text-primary"
                                                            : "border-transparent text-gray-455 hover:text-gray-600"
                                                    )}
                                                >
                                                    De Hoy ({todayTasks.length})
                                                </button>
                                                <button
                                                    onClick={() => setTaskActiveTab('upcoming')}
                                                    type="button"
                                                    className={cn(
                                                        "pb-2 text-xs font-bold border-b-2 px-2 transition-all whitespace-nowrap",
                                                        taskActiveTab === 'upcoming'
                                                            ? "border-purple-500 text-purple-600"
                                                            : "border-transparent text-gray-455 hover:text-gray-600"
                                                    )}
                                                >
                                                    Siguientes ({upcomingTasks.length})
                                                </button>
                                                {selectedCalendarDate && (
                                                    <button
                                                        onClick={() => setTaskActiveTab('selected')}
                                                        type="button"
                                                        className={cn(
                                                            "pb-2 text-xs font-bold border-b-2 px-2 transition-all whitespace-nowrap flex items-center gap-1",
                                                            taskActiveTab === 'selected'
                                                                ? "border-teal-500 text-teal-600"
                                                                : "border-transparent text-gray-455 hover:text-gray-600"
                                                        )}
                                                    >
                                                        Día {new Date(selectedCalendarDate + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} ({selectedTasks.length})
                                                        <span
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedCalendarDate(null);
                                                                setTaskActiveTab('today');
                                                            }}
                                                            className="p-0.5 hover:bg-gray-100 rounded-full ml-1 cursor-pointer"
                                                        >
                                                            <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
                                                        </span>
                                                    </button>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>

                                {/* Task list content */}
                                <div className="flex-1 overflow-y-auto space-y-3 max-h-[350px] custom-scrollbar pr-1">
                                    {(() => {
                                        const todayStr = getLocalYYYYMMDD();
                                        const overdueTasks = tasks.filter(t => t.due_date < todayStr && t.status !== 'completed');
                                        const todayTasks = tasks.filter(t => t.due_date === todayStr);
                                        const upcomingTasks = tasks.filter(t => t.due_date > todayStr);
                                        const selectedTasks = selectedCalendarDate ? tasks.filter(t => t.due_date === selectedCalendarDate) : [];

                                        const activeListTasks = 
                                            taskActiveTab === 'overdue' ? overdueTasks :
                                            taskActiveTab === 'today' ? todayTasks :
                                            taskActiveTab === 'upcoming' ? upcomingTasks :
                                            selectedTasks;

                                        if (activeListTasks.length === 0) {
                                            return (
                                                <div className="text-center py-12 border border-dashed border-gray-150 rounded-2xl bg-gray-50/30">
                                                    <Check className="h-6 w-6 text-green-500 mx-auto mb-2" />
                                                    <h4 className="font-bold text-gray-700 text-xs">¡No hay tareas pendientes!</h4>
                                                    <p className="text-gray-400 text-[10px] mt-0.5">Todo al día en esta sección.</p>
                                                </div>
                                            );
                                        }

                                        return activeListTasks.map(task => {
                                            const associatedLead = leads.find(l => l.id === task.lead_id);
                                            const statusObj = TASK_STATUSES.find(s => s.value === task.status);

                                            return (
                                                <div
                                                    key={task.id}
                                                    className={cn(
                                                        "p-3.5 rounded-2xl border bg-white hover:shadow-md transition-all flex items-start gap-3 relative group",
                                                        task.status === 'completed'
                                                            ? "bg-gray-50/50 border-gray-100 opacity-75"
                                                            : taskActiveTab === 'overdue'
                                                                ? "border-red-100 hover:border-red-200 bg-red-50/5"
                                                                : "border-gray-100 hover:border-gray-200"
                                                    )}
                                                >
                                                    {/* Complete Checkbox */}
                                                    <button
                                                        onClick={() => handleUpdateTask(task.id, { status: task.status === 'completed' ? 'not_started' : 'completed' })}
                                                        type="button"
                                                        className="mt-0.5 text-gray-400 hover:text-green-600 transition-colors shrink-0"
                                                    >
                                                        {task.status === 'completed' ? (
                                                            <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-50" />
                                                        ) : (
                                                            <div className="h-5 w-5 rounded-full border-2 border-gray-300 hover:border-green-500 transition-all" />
                                                        )}
                                                    </button>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className={cn(
                                                                "font-bold text-gray-950 text-sm line-clamp-1",
                                                                task.status === 'completed' ? "line-through text-gray-400" : ""
                                                            )}>
                                                                {task.title}
                                                            </h4>
                                                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-auto bg-white pl-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingTask(task);
                                                                        setIsCreatingTask(true);
                                                                    }}
                                                                    type="button"
                                                                    className="p-1 hover:bg-gray-150 rounded text-gray-500 hover:text-primary transition-all"
                                                                    title="Editar"
                                                                >
                                                                    <Edit className="h-3.5 w-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteTask(task.id)}
                                                                    type="button"
                                                                    className="p-1 hover:bg-red-50 rounded text-gray-500 hover:text-red-600 transition-all"
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {task.description && (
                                                            <p className={cn(
                                                                "text-gray-500 text-xs mt-1.5 leading-relaxed line-clamp-2",
                                                                task.status === 'completed' ? "text-gray-400" : ""
                                                            )}>
                                                                {task.description}
                                                            </p>
                                                        )}

                                                        <div className="flex flex-wrap items-center gap-2 mt-3 text-[10px]">
                                                            {associatedLead && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedLead(associatedLead);
                                                                        setIsEditing(false);
                                                                    }}
                                                                    type="button"
                                                                    className="inline-flex items-center gap-1 font-extrabold text-blue-605 hover:text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full hover:underline"
                                                                >
                                                                    👤 Lead: {associatedLead.client_name}
                                                                </button>
                                                            )}
                                                            
                                                            <span className={cn(
                                                                "inline-flex items-center font-bold px-2 py-0.5 rounded-full border gap-1",
                                                                task.status === 'completed'
                                                                    ? "bg-green-50 text-green-700 border-green-100"
                                                                    : taskActiveTab === 'overdue'
                                                                        ? "bg-red-50 text-red-700 border-red-100"
                                                                        : "bg-gray-50 text-gray-500 border-gray-100"
                                                            )}>
                                                                ⏰ {new Date(task.due_date + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                            </span>

                                                            <span className={cn(
                                                                "inline-flex items-center font-bold px-2 py-0.5 rounded-full border",
                                                                statusObj ? `${statusObj.color} border-current/15` : "bg-gray-50 text-gray-500"
                                                            )}>
                                                                {statusObj?.label || task.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Primary Section Buttons */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-5 tracking-tight uppercase">Secciones de Gestión</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Section 1: Manejo de Ventas */}
                            <div
                                onClick={() => setView('sales')}
                                className="bg-white p-6 rounded-3xl border border-gray-200 hover:border-primary/40 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">Manejo de Ventas</h3>
                                    <p className="text-gray-500 text-sm mt-2 leading-relaxed mb-4">Prospectos entrantes, contactos iniciales y cotizaciones activas de clientes.</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Nuevos: {stats.new}</span>
                                        <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full">Contactados: {stats.contacted}</span>
                                        <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">Cotizados: {stats.proposal}</span>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-gray-500 font-medium text-xs">Total de registros:</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-extrabold rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {stats.new + stats.contacted + stats.proposal}
                                    </span>
                                </div>
                            </div>

                            {/* Section 2: Manejo de Post Venta */}
                            <div
                                onClick={() => setView('post-sales')}
                                className="bg-white p-6 rounded-3xl border border-gray-200 hover:border-primary/40 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">Manejo de Post Venta</h3>
                                    <p className="text-gray-500 text-sm mt-2 leading-relaxed mb-4">Ventas ganadas, reservas de Disney, plazos de 60 días, pagos pendientes y viajes realizados.</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full">Ganadas: {stats.won}</span>
                                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full">&gt;60d: {stats.reservation_60_plus}</span>
                                        <span className="px-2 py-0.5 bg-pink-50 text-pink-700 text-[10px] font-bold rounded-full">&lt;=60d: {stats.reservation_60_minus}</span>
                                        <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[10px] font-bold rounded-full">Disney: {stats.disney_reserved}</span>
                                        <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-full">Viajes: {stats.trip_completed}</span>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-gray-500 font-medium text-xs">Total de registros:</span>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        {stats.won + stats.reservation_60_plus + stats.reservation_60_minus + stats.disney_reserved + stats.trip_completed}
                                    </span>
                                </div>
                            </div>

                            {/* Section 3: Leads Perdidos */}
                            <div
                                onClick={() => setView('lost')}
                                className="bg-white p-6 rounded-3xl border border-gray-200 hover:border-primary/40 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                        <XCircle className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">Leads Perdidos</h3>
                                    <p className="text-gray-500 text-sm mt-2 leading-relaxed mb-4">Cotizaciones y oportunidades de venta que no se concretaron.</p>
                                    <div className="flex">
                                        <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full">Perdidos: {stats.lost}</span>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-gray-500 font-medium text-xs">Total de registros:</span>
                                    <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-extrabold rounded-full group-hover:bg-red-600 group-hover:text-white transition-colors">
                                        {stats.lost}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Urgent Action Section: Upcoming trips without reservation */}
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                                    Atención Requerida: Próximos Viajes sin Confirmar
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">Clientes con viaje a menos de 60 días que aún no tienen registrado un número de reserva/booking.</p>
                            </div>
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-extrabold rounded-full border border-amber-200/50 self-start sm:self-auto">
                                {urgentLeads.length} {urgentLeads.length === 1 ? 'cliente' : 'clientes'}
                            </span>
                        </div>

                        {urgentLeads.length > 0 ? (
                            <div className="overflow-x-auto -mx-6 md:mx-0">
                                <table className="w-full text-left border-collapse text-sm min-w-[600px]">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                                            <th className="p-4 pl-6 md:pl-4">Cliente</th>
                                            <th className="p-4">Destino</th>
                                            <th className="p-4">Fecha Check-in</th>
                                            <th className="p-4">Días Restantes</th>
                                            <th className="p-4">Etapa Actual</th>
                                            <th className="p-4 text-right pr-6 md:pr-4">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {urgentLeads.map((lead) => {
                                            const todayStr = getLocalYYYYMMDD();
                                            const todayTime = new Date(todayStr + 'T00:00:00').getTime();
                                            const checkInTime = lead.check_in ? new Date(lead.check_in + 'T00:00:00').getTime() : 0;
                                            const diffTime = checkInTime - todayTime;
                                            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                                            
                                            const stageObj = LEAD_STATUSES.find(s => s.value === lead.status);

                                            return (
                                                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="p-4 pl-6 md:pl-4">
                                                        <div className="font-bold text-gray-900 cursor-pointer hover:text-primary" onClick={() => setSelectedLead(lead)}>
                                                            {lead.client_name || 'Sin nombre'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{lead.email || 'Sin correo'}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-medium text-gray-700">{lead.destination || 'Sin destino'}</div>
                                                        <div className="text-xs text-gray-500">{lead.travelers}</div>
                                                    </td>
                                                    <td className="p-4 font-semibold text-gray-700">
                                                        {lead.check_in ? new Date(lead.check_in + 'T00:00:00').toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) : 'Sin fecha'}
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={cn(
                                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
                                                            diffDays <= 30 
                                                                ? "bg-red-50 text-red-700 border-red-100" 
                                                                : "bg-amber-50 text-amber-700 border-amber-100"
                                                        )}>
                                                            ⏰ {diffDays} {diffDays === 1 ? 'día' : 'días'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={cn(
                                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
                                                            stageObj ? `${stageObj.color} border-current/10` : "bg-gray-50 text-gray-600"
                                                        )}>
                                                            {stageObj?.label || lead.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right pr-6 md:pr-4">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedLead(lead);
                                                                setIsEditing(true);
                                                            }}
                                                            className="px-3 py-1.5 bg-primary text-white hover:bg-primary/90 text-xs font-bold rounded-full transition-colors shadow-sm"
                                                        >
                                                            Agregar Reserva
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                                <h3 className="font-bold text-gray-800 text-sm">¡Al día!</h3>
                                <p className="text-gray-400 text-xs mt-1">Todos los clientes próximos a viajar tienen su número de reserva asignado.</p>
                            </div>
                        )}
                    </div>

                    {/* Site Settings & Resource Config Quick Actions */}
                    <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 mt-8 shadow-sm">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Configuraciones del Sistema</h3>
                            <p className="text-xs text-slate-500 mt-1">Herramientas administrativas y de edición de contenido para el sitio.</p>
                        </div>
                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                            <button
                                onClick={() => setView('resources_config')}
                                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 text-xs font-bold text-gray-700 rounded-xl transition-all shadow-sm hover:shadow-md"
                            >
                                <Lock className="h-4 w-4 text-violet-500" />
                                Configurar PDFs
                            </button>
                            <button
                                onClick={() => setView('site_config')}
                                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50 text-xs font-bold text-gray-700 rounded-xl transition-all shadow-sm hover:shadow-md"
                            >
                                <Sliders className="h-4 w-4 text-amber-500" />
                                Configurar Sitio (CMS)
                            </button>
                        </div>
                    </div>
                </div>
            ) : view === 'help' ? (
                /* HELP & USER MANUAL VIEW */
                <div className="space-y-8 animate-in fade-in duration-300">
                    <button
                        onClick={() => setView('portal')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary transition-colors bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md"
                    >
                        <ArrowLeft className="h-4 w-4" /> Volver al Portal
                    </button>

                    <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 p-8 rounded-3xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
                                <BookOpen className="h-8 w-8 text-primary" />
                                Manual de Usuario & Ayuda
                            </h1>
                            <p className="text-gray-500 mt-1.5 text-base">Guía completa para sacarle el máximo provecho a Here We Go Advisor y optimizar tus ventas.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                        {/* Sidebar Navigation */}
                        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4 space-y-1 lg:sticky lg:top-24">
                            {[
                                { id: 'sales_strategy', label: '🚀 Estrategia de Ventas', desc: 'CRM, Tiempos y Conversión' },
                                { id: 'leads_pipeline', label: '💼 Gestión de Leads', desc: 'Uso del Pipeline / Estados' },
                                { id: 'tasks_org', label: '📅 Tareas y Organización', desc: 'Calendario y Recordatorios' },
                                { id: 'resources_center', label: '🔒 Centro de Recursos', desc: 'PIN de Clientes y PDFs' },
                                { id: 'cms_editor', label: '🌐 Editor del Sitio', desc: 'Galería, Blog, Reviews y CMS' }
                            ].map((chapter) => (
                                <button
                                    key={chapter.id}
                                    onClick={() => setActiveHelpChapter(chapter.id as any)}
                                    className={cn(
                                        "w-full text-left p-3.5 rounded-2xl transition-all flex flex-col gap-1 border",
                                        activeHelpChapter === chapter.id
                                            ? "bg-primary text-white border-primary shadow-sm hover:bg-primary"
                                            : "bg-white text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-150"
                                    )}
                                >
                                    <span className="font-bold text-sm">{chapter.label}</span>
                                    <span className={cn(
                                        "text-[10px] font-medium",
                                        activeHelpChapter === chapter.id ? "text-white/80" : "text-gray-400"
                                    )}>{chapter.desc}</span>
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-200 shadow-sm p-8 md:p-10 min-h-[500px]">
                            {activeHelpChapter === 'sales_strategy' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                                        🚀 Estrategia de Ventas: Gestión del Tiempo y Seguimiento
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        El éxito de Here We Go Advisor depende de la confianza y de una experiencia de cliente sin fricción. Este sistema está diseñado para ayudarte a responder con rapidez y realizar un seguimiento inteligente.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                                        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
                                            <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                                                ⏱️ La Regla de Oro de los 15 Minutos
                                            </h4>
                                            <p className="text-xs text-amber-800 mt-2 leading-relaxed">
                                                Las estadísticas de ventas de viajes demuestran que un lead que es contactado en los primeros 15 minutos tiene **un 300% más de probabilidad de concretar su reserva**. Cuando veas un lead en <span className="font-bold">Nuevos Leads</span>, mándale un correo o un mensaje de WhatsApp inicial rápido de inmediato.
                                            </p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-violet-50/50 border border-violet-100">
                                            <h4 className="font-bold text-violet-900 text-sm flex items-center gap-1.5">
                                                🛎️ La Regla Crítica de los 60 días
                                            </h4>
                                            <p className="text-xs text-violet-850 mt-2 leading-relaxed">
                                                En viajes a Disney, el día 60 antes del viaje es crucial para que el cliente reserve restaurantes con personajes y acceda a las mejores tarifas de comida. Si un cliente está a menos de 60 días y no tiene guardado un código de reserva, se activará en tu tablero de <span className="font-bold">Atención Requerida</span>. ¡Consigue esa clave y agrégala al lead!
                                            </p>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-gray-800 text-base mt-6">Cómo aumentar tu tasa de conversión:</h3>
                                    <ul className="space-y-3 pl-5 list-disc text-gray-600 text-xs leading-relaxed">
                                        <li><strong>No dejes leads en "Nuevos" por más de 24 horas:</strong> Si no se puede avanzar inmediatamente, pásalo a "Contactado" indicando que ya le has escrito.</li>
                                        <li><strong>Configura tareas para cada lead:</strong> Siempre que envíes una cotización, crea una tarea con vencimiento a los 3 días que diga "Seguimiento de cotización". Esto evita que olvides leads.</li>
                                        <li><strong>Aprovecha el Centro de Recursos como valor agregado:</strong> Habilita el acceso y genera un PIN de seguridad. Explícale al cliente que este es un servicio Concierge exclusivo y gratuito para ellos.</li>
                                    </ul>
                                </div>
                            )}

                            {activeHelpChapter === 'leads_pipeline' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 pb-3 border-b border-gray-100">
                                        💼 Gestión de Leads y Estados del CRM
                                    </h2>
                                    <p className="text-gray-650 leading-relaxed text-sm">
                                        El CRM está organizado en tableros visuales divididos en tres etapas lógicas para simplificar tu trabajo diario.
                                    </p>

                                    <div className="space-y-6 mt-4">
                                        <div className="border-l-4 border-blue-500 pl-4 py-1">
                                            <h3 className="font-bold text-gray-900 text-sm">1. Manejo de Ventas (Fase de Prospección)</h3>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                Contiene leads que aún no han pagado su reserva. Tu objetivo aquí es la persuasión y el diseño del viaje.
                                            </p>
                                            <ul className="text-xs text-gray-600 mt-2 list-disc pl-5 space-y-1">
                                                <li><strong>Nuevo:</strong> Solicitudes entrantes desde el formulario de contacto o llamadas iniciales. Requieren llamada inmediata.</li>
                                                <li><strong>Contactado:</strong> El lead ha respondido o ya está en comunicación contigo (WhatsApp/Llamada).</li>
                                                <li><strong>Cotización Enviada:</strong> Le has enviado una propuesta de viaje de forma detallada. Programa una tarea de seguimiento en 2-3 días.</li>
                                            </ul>
                                        </div>

                                        <div className="border-l-4 border-emerald-500 pl-4 py-1">
                                            <h3 className="font-bold text-gray-900 text-sm">2. Manejo de Post Venta (Fase de Reserva y Operación)</h3>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                ¡Ventas cerradas! Aquí organizas la logística de viaje y te aseguras de cumplir los plazos de Disney/Universal.
                                            </p>
                                            <ul className="text-xs text-gray-600 mt-2 list-disc pl-5 space-y-1">
                                                <li><strong>Ganado:</strong> Depósito inicial realizado. El viaje está confirmado.</li>
                                                <li><strong>Disney Reservado:</strong> Tienen número de booking registrado en su perfil. Habilítales el acceso al Centro de Recursos.</li>
                                                <li><strong>Viaje Completado:</strong> El cliente regresó de su viaje. Envía el link para que escriba su testimonio.</li>
                                            </ul>
                                        </div>

                                        <div className="border-l-4 border-red-500 pl-4 py-1">
                                            <h3 className="font-bold text-gray-900 text-sm">3. Leads Perdidos (Archivo)</h3>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                Clientes que no compraron por presupuesto, fecha u otras razones. Mantenerlos aquí limpia tu flujo de trabajo principal.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeHelpChapter === 'tasks_org' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 pb-3 border-b border-gray-100">
                                        📅 Gestión de Tareas y Calendario
                                    </h2>
                                    <p className="text-gray-650 leading-relaxed text-sm">
                                        El organizador de tareas integrado te ayuda a planificar tu día y hacer seguimiento exacto para no perder oportunidades de venta.
                                    </p>

                                    <div className="bg-slate-50 border border-gray-150 rounded-2xl p-5 space-y-4">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                                                ✏️ Creación y Vínculo
                                            </h4>
                                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                                Al crear una tarea, puedes **vincularla a un cliente específico (Lead)**. Esto asocia directamente la tarea a su expediente.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                                                📆 Calendario Interactivo
                                            </h4>
                                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                                El mini-calendario de la izquierda muestra indicadores de colores en los días con tareas pendientes. Haz clic en cualquier día para filtrar la lista.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                                                🚨 Tareas Vencidas
                                            </h4>
                                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                                Aparecen en la pestaña **Vencidas** con un borde rojo llamativo. Resuélvelas primero cada mañana para no perder leads calientes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeHelpChapter === 'resources_center' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 pb-3 border-b border-gray-100">
                                        🔒 Centro de Recursos y Control de Acceso
                                    </h2>
                                    <p className="text-gray-650 leading-relaxed text-sm">
                                        El Centro de Recursos es un portal privado donde tus clientes visualizan sus guías de viaje (en PDF) de forma protegida para evitar descargas o impresiones no autorizadas.
                                    </p>

                                    <h3 className="font-bold text-gray-800 text-base mt-4">Cómo dar acceso a un cliente:</h3>
                                    <ol className="space-y-3 list-decimal pl-5 text-gray-600 text-xs leading-relaxed">
                                        <li>Ve a tu lista de leads y haz clic en el nombre del cliente para abrir sus detalles.</li>
                                        <li>Busca la sección **Centro de Recursos (PIN)**.</li>
                                        <li>Activa el interruptor <span className="font-bold text-green-600">Habilitar Centro de Recursos</span>.</li>
                                        <li>Haz clic en <span className="font-bold text-primary">Generar PIN</span> para asignar un código numérico único de 4 dígitos.</li>
                                        <li>Marca las casillas correspondientes a las categorías de viaje que tiene habilitadas (Walt Disney World, Disneyland, Disney Cruise Line). Solo podrá ver las guías asociadas a estas casillas.</li>
                                        <li>Haz clic en **Guardar**. El acceso del cliente **caducará automáticamente** en cuanto llegue la fecha de su checkout registrado.</li>
                                    </ol>

                                    <div className="p-4 rounded-xl bg-violet-50 border border-violet-100 mt-4">
                                        <h4 className="font-bold text-violet-900 text-xs">📂 Administración de archivos PDF:</h4>
                                        <p className="text-xs text-violet-800 mt-1.5 leading-relaxed">
                                            Usa el botón **Configurar PDFs** al pie del portal de administración para subir nuevos archivos, cambiar los títulos de las guías, o borrar guías obsoletas de forma dinámica.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeHelpChapter === 'cms_editor' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 pb-3 border-b border-gray-100">
                                        🌐 Editor del Sitio (CMS - Gestor de Contenido)
                                    </h2>
                                    <p className="text-gray-650 leading-relaxed text-sm">
                                        No necesitas programar para actualizar el diseño de la página de Here We Go Advisor. Todo se hace de forma visual desde la pestaña **Configurar Sitio (CMS)** en el pie del panel administrativo.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                        <div className="p-4 rounded-xl border border-gray-150">
                                            <h4 className="font-bold text-gray-900 text-xs">📸 Galería del Home</h4>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                Sube fotos directamente. Puedes hacer clic en **Editar** en el overlay de cualquier foto para modificar su texto alternativo (alt text) para SEO o hacer clic en **Eliminar** para removerla.
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl border border-gray-150">
                                            <h4 className="font-bold text-gray-900 text-xs">⭐ Reseñas</h4>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                Las opiniones que los clientes envían se listan aquí. Puedes activarlas, desactivarlas para que no se muestren, o redactar testimonios manuales que recibas por WhatsApp.
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl border border-gray-150">
                                            <h4 className="font-bold text-gray-900 text-xs">✍️ Sobre Mí</h4>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                Modifica la biografía de Anna Karen, el saludo, tu rol certificado, la cita inspiradora y sube retratos de graduación o de cuerpo completo de forma instantánea.
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl border border-gray-150">
                                            <h4 className="font-bold text-gray-900 text-xs">✈️ Destinos</h4>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                Personaliza el overview, los puntos destacados (highlights), imperdibles (must-dos) y consejos (tips) de Walt Disney World, Disneyland, Disney Cruise y Universal.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl border border-gray-150 mt-4">
                                        <h4 className="font-bold text-gray-900 text-xs">📝 Posts del Blog</h4>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            Crea artículos. Puedes agregar títulos, categorías, resúmenes atractivos (excerpts), el tiempo estimado de lectura y escribir el cuerpo del post usando HTML o texto normal. Puedes cargar la imagen de portada y guardar.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : view === 'resources_config' ? (
                /* Resource Config View */
                <div className="space-y-8 animate-in fade-in duration-300">
                    <button
                        onClick={() => setView('portal')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary transition-colors bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md"
                    >
                        <ArrowLeft className="h-4 w-4" /> Volver al Portal
                    </button>

                    <div className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-8 rounded-3xl border border-violet-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Configurar Recursos del Viajero</h1>
                            <p className="text-gray-500 mt-1.5 text-base">Administra y sube los documentos guías en PDF que verán los clientes en sus portales.</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {['wdw', 'dl', 'dcl'].map(category => {
                            const catLabel = category === 'wdw' ? 'Walt Disney World (Orlando)' : category === 'dl' ? 'Disneyland California' : 'Disney Cruise Line';
                            const colorClass = category === 'wdw' ? 'text-violet-600 bg-violet-50 border-violet-100' : category === 'dl' ? 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100' : 'text-indigo-600 bg-indigo-50 border-indigo-100';
                            
                            const btnColorClass = category === 'wdw' 
                                ? 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white focus:ring-violet-500/20' 
                                : category === 'dl' 
                                ? 'bg-fuchsia-600 hover:bg-fuchsia-700 active:bg-fuchsia-800 text-white focus:ring-fuchsia-500/20' 
                                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white focus:ring-indigo-500/20';

                            const categorySlots = resourcesList.filter(s => s.category === category);

                            return (
                                <div key={category} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}>
                                                {catLabel}
                                            </span>
                                        </div>
                                        {activeAddCategory !== category && (
                                            <button
                                                onClick={() => {
                                                    setActiveAddCategory(category as 'wdw' | 'dl' | 'dcl');
                                                    setNewResourceTitle("");
                                                    setNewResourceFile(null);
                                                }}
                                                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${btnColorClass}`}
                                            >
                                                <Plus className="h-3.5 w-3.5" /> Agregar Guía
                                            </button>
                                        )}
                                    </div>
                                    <div className="p-6 divide-y divide-gray-100">
                                        {activeAddCategory === category && (
                                            <div className="mb-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl animate-in slide-in-from-top duration-200 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Nueva Guía - {catLabel}</h5>
                                                    <button
                                                        onClick={() => setActiveAddCategory(null)}
                                                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="block text-xs font-bold text-gray-500">Título de la Guía</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Ej: Guía de Lightning Lane Multi Pass"
                                                            value={newResourceTitle}
                                                            onChange={(e) => setNewResourceTitle(e.target.value)}
                                                            className="w-full h-10 px-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xs bg-white text-gray-800 font-medium"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="block text-xs font-bold text-gray-500">Archivo PDF (Opcional)</label>
                                                        <div className="flex items-center gap-2">
                                                            <label className="flex-1 h-10 px-3.5 rounded-xl border border-gray-300 border-dashed hover:border-violet-450 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-white">
                                                                <Upload className="h-3.5 w-3.5 text-gray-400" />
                                                                <span className="text-xs text-gray-500 font-medium truncate">
                                                                    {newResourceFile ? newResourceFile.name : "Seleccionar archivo .pdf"}
                                                                </span>
                                                                <input
                                                                    type="file"
                                                                    accept=".pdf"
                                                                    className="hidden"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) setNewResourceFile(file);
                                                                    }}
                                                                />
                                                            </label>
                                                            {newResourceFile && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setNewResourceFile(null)}
                                                                    className="h-10 w-10 border border-gray-300 hover:border-red-300 text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                                                    <button
                                                        onClick={() => setActiveAddCategory(null)}
                                                        className="px-4 py-2 text-slate-500 hover:text-slate-700 bg-slate-200/60 hover:bg-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (!newResourceTitle.trim()) {
                                                                alert("Por favor, ingresa un título para la guía.");
                                                                return;
                                                            }
                                                            await handleAddResource(category as 'wdw' | 'dl' | 'dcl', newResourceTitle, newResourceFile);
                                                            setNewResourceTitle("");
                                                            setNewResourceFile(null);
                                                            setActiveAddCategory(null);
                                                        }}
                                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm ${btnColorClass}`}
                                                    >
                                                        Guardar Guía
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {categorySlots.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400 text-xs font-medium">
                                                No hay guías configuradas para esta sección. Haz clic en &quot;Agregar Guía&quot; para crear la primera.
                                            </div>
                                        ) : (
                                            categorySlots.map(slot => {
                                                const pdfUrl = slot.pdf_url;
                                                const isUploading = uploadingResourceId === slot.id;

                                                return (
                                                    <div key={slot.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 text-sm">{slot.title}</h4>
                                                            <span className="text-xs text-gray-400">ID: {slot.id}</span>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            {pdfUrl ? (
                                                                <>
                                                                    <a
                                                                        href={pdfUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                                                                    >
                                                                        <Eye className="h-3.5 w-3.5" /> Ver PDF
                                                                    </a>
                                                                    <button
                                                                        onClick={() => handleDeleteResource(slot.id)}
                                                                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" /> Eliminar
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <div className="flex items-center">
                                                                    <label className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm flex items-center gap-1.5">
                                                                        {isUploading ? (
                                                                            <>
                                                                                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                                </svg>
                                                                                <span>Subiendo...</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Upload className="h-3.5 w-3.5" /> Subir Guía PDF
                                                                            </>
                                                                        )}
                                                                        <input
                                                                            type="file"
                                                                            accept=".pdf"
                                                                            className="hidden"
                                                                            disabled={isUploading}
                                                                            onChange={(e) => {
                                                                                const file = e.target.files?.[0];
                                                                                if (file) handleUploadResource(slot.id, file);
                                                                            }}
                                                                        />
                                                                    </label>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : view === 'site_config' ? (
                /* Site Config CMS View */
                <div className="space-y-8 animate-in fade-in duration-300">
                    <button
                        onClick={() => setView('portal')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary transition-colors bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md"
                    >
                        <ArrowLeft className="h-4 w-4" /> Volver al Portal
                    </button>

                    <div className="bg-gradient-to-r from-amber-500/10 to-pink-500/10 p-8 rounded-3xl border border-amber-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Configuración del Sitio (CMS)</h1>
                            <p className="text-gray-500 mt-1.5 text-base">Modifica y administra el contenido visual, textos, destinos y posts del blog de Here We Go Advisor.</p>
                        </div>
                    </div>

                    {/* Tabs navigation */}
                    <div className="flex border-b border-gray-200 gap-4 overflow-x-auto pb-px">
                        {[
                            { id: 'gallery', label: '📸 Galería Home' },
                            { id: 'reviews', label: '⭐ Cintillo de Reseñas' },
                            { id: 'about', label: '✨ Página Sobre Mí' },
                            { id: 'destinations', label: '🗺️ Destinos' },
                            { id: 'blog', label: '✍️ Blog' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveConfigTab(tab.id as any)}
                                className={cn(
                                    "px-4 py-2.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer",
                                    activeConfigTab === tab.id
                                        ? "border-primary text-primary"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab contents */}
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
                        {activeConfigTab === 'gallery' && (
                            /* GALLERY PANEL */
                            <div className="space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800 text-lg">Galería del Home</h3>
                                    <label className="px-4 py-2 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5">
                                        <Plus className="h-3.5 w-3.5" /> Agregar Imagen
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={isUploadingGallery}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const alt = prompt("Ingresa una breve descripción (texto alternativo) para esta foto:") || "Imagen de la galería";
                                                    handleAddGalleryImage(file, alt);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>

                                {isUploadingGallery && (
                                    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-2xl">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {galleryList.map((item) => (
                                        <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center shadow-sm animate-in fade-in duration-200">
                                            <img
                                                src={item.image_url}
                                                alt={item.alt}
                                                className="object-cover w-full h-full"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                                                <p className="text-xs font-semibold line-clamp-3">{item.alt}</p>
                                                <div className="flex gap-2 w-full justify-between items-center mt-2">
                                                    <button
                                                        onClick={() => {
                                                            const newAlt = prompt("Edita el texto alternativo / descripción de esta foto:", item.alt);
                                                            if (newAlt !== null && newAlt.trim() !== "") {
                                                                handleUpdateGalleryImageAlt(item.id, newAlt);
                                                            }
                                                        }}
                                                        className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-[10px] font-bold transition-colors shadow-md flex items-center gap-1 flex-1 justify-center"
                                                    >
                                                        <Edit className="h-3 w-3" /> Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteGalleryImage(item.id)}
                                                        className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold transition-colors shadow-md flex items-center gap-1 flex-1 justify-center"
                                                    >
                                                        <Trash2 className="h-3 w-3" /> Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeConfigTab === 'reviews' && (
                            /* REVIEWS PANEL */
                            <div className="space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800 text-lg">Reseñas y Testimonios</h3>
                                    <button
                                        onClick={() => {
                                            setEditingReview({ id: 0, name: "", role: "", content: "", rating: 5, is_approved: true });
                                            setIsCreatingReview(true);
                                        }}
                                        className="px-4 py-2 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5"
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Agregar Reseña
                                    </button>
                                </div>

                                {/* Review form overlay / block */}
                                {(isCreatingReview || editingReview) && (
                                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl animate-in slide-in-from-top duration-200 space-y-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-gray-800 text-sm">{editingReview?.id === 0 ? "Nueva Reseña" : "Editar Reseña"}</h4>
                                            <button onClick={() => { setEditingReview(null); setIsCreatingReview(false); }} className="text-gray-400 hover:text-gray-600">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Nombre del Cliente</label>
                                                <input
                                                    type="text"
                                                    value={editingReview?.name || ""}
                                                    onChange={(e) => setEditingReview(prev => prev ? { ...prev, name: e.target.value } : null)}
                                                    className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium"
                                                    placeholder="Ej: María G."
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Rol / Etiqueta</label>
                                                <input
                                                    type="text"
                                                    value={editingReview?.role || ""}
                                                    onChange={(e) => setEditingReview(prev => prev ? { ...prev, role: e.target.value } : null)}
                                                    className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium"
                                                    placeholder="Ej: Mamá de 3 / Luna de Miel"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Calificación (Estrellas)</label>
                                                <select
                                                    value={editingReview?.rating || 5}
                                                    onChange={(e) => setEditingReview(prev => prev ? { ...prev, rating: parseInt(e.target.value) } : null)}
                                                    className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-bold"
                                                >
                                                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} estrellas</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-gray-500">Contenido del Testimonio</label>
                                            <textarea
                                                value={editingReview?.content || ""}
                                                onChange={(e) => setEditingReview(prev => prev ? { ...prev, content: e.target.value } : null)}
                                                className="w-full p-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium h-24 resize-none"
                                                placeholder="Escribe el testimonio del cliente..."
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="review_is_approved"
                                                checked={editingReview?.is_approved ?? true}
                                                onChange={(e) => setEditingReview(prev => prev ? { ...prev, is_approved: e.target.checked } : null)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <label htmlFor="review_is_approved" className="text-xs font-bold text-gray-600 cursor-pointer select-none">Mostrar públicamente en el cintillo (Aprobado)</label>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                                            <button
                                                onClick={() => { setEditingReview(null); setIsCreatingReview(false); }}
                                                className="px-4 py-2 text-slate-500 hover:text-slate-700 bg-slate-200/60 hover:bg-slate-200 text-xs font-bold rounded-xl"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (!editingReview?.name || !editingReview.content) {
                                                        alert("El nombre y contenido de la reseña son requeridos.");
                                                        return;
                                                    }
                                                    await handleSaveReview(editingReview);
                                                    setEditingReview(null);
                                                    setIsCreatingReview(false);
                                                }}
                                                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-sm"
                                            >
                                                Guardar Reseña
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="divide-y divide-gray-150 border border-gray-200 rounded-2xl overflow-hidden bg-white">
                                    {reviewsList.length === 0 ? (
                                        <div className="p-8 text-center text-gray-400 text-xs font-semibold">No hay reseñas registradas aún.</div>
                                    ) : (
                                        reviewsList.map((rev) => (
                                            <div key={rev.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-800 text-sm">{rev.name}</span>
                                                        <span className="text-[10px] text-gray-400 font-medium">({rev.role})</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 line-clamp-2 italic">"{rev.content}"</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex text-amber-400">
                                                            {[...Array(rev.rating)].map((_, i) => (
                                                                <Star key={i} className="h-3 w-3 fill-current" />
                                                            ))}
                                                        </div>
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-[9px] font-bold border",
                                                            rev.is_approved ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                                                        )}>
                                                            {rev.is_approved ? "Aprobada" : "Oculta"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                                    <button
                                                        onClick={() => {
                                                            setEditingReview(rev);
                                                        }}
                                                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" /> Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteReview(rev.id)}
                                                        className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" /> Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeConfigTab === 'about' && (
                            /* ABOUT ME PANEL */
                            <div className="space-y-6">
                                <h3 className="font-bold text-gray-800 text-lg pb-4 border-b border-gray-100">Editar Página Sobre Mí</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-gray-500">Título de la Página</label>
                                            <input
                                                type="text"
                                                value={aboutMeData.about_me_title || ""}
                                                onChange={(e) => setAboutMeData(prev => ({ ...prev, about_me_title: e.target.value }))}
                                                className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-semibold animate-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-gray-500">Saludo de Bienvenida</label>
                                            <input
                                                type="text"
                                                value={aboutMeData.about_me_greeting || ""}
                                                onChange={(e) => setAboutMeData(prev => ({ ...prev, about_me_greeting: e.target.value }))}
                                                className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-semibold"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-gray-500">Rol / Subtítulo</label>
                                            <input
                                                type="text"
                                                value={aboutMeData.about_me_role || ""}
                                                onChange={(e) => setAboutMeData(prev => ({ ...prev, about_me_role: e.target.value }))}
                                                className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-semibold"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-gray-500">Frase o Cita de Firma</label>
                                            <input
                                                type="text"
                                                value={aboutMeData.about_me_quote || ""}
                                                onChange={(e) => setAboutMeData(prev => ({ ...prev, about_me_quote: e.target.value }))}
                                                className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 italic font-semibold"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-gray-500">Párrafos Sobre Mí (JSON o Texto)</label>
                                            <span className="text-[10px] text-gray-400 block pb-1">Ingresa los párrafos de tu biografía, separados por dos saltos de línea (una línea vacía en medio).</span>
                                            <textarea
                                                value={(() => {
                                                    try {
                                                        const arr = JSON.parse(aboutMeData.about_me_paragraphs);
                                                        return Array.isArray(arr) ? arr.join('\n\n') : aboutMeData.about_me_paragraphs;
                                                    } catch (e) {
                                                        return aboutMeData.about_me_paragraphs;
                                                    }
                                                })()}
                                                onChange={(e) => {
                                                    const lines = e.target.value.split('\n\n').filter(l => l.trim());
                                                    setAboutMeData(prev => ({ ...prev, about_me_paragraphs: JSON.stringify(lines) }));
                                                }}
                                                className="w-full p-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium h-60 resize-none leading-relaxed"
                                                placeholder="Escribe cada párrafo separado por una línea en blanco..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-500">Imagen de Graduación Disney (Izq.)</label>
                                        <div className="flex items-center gap-4">
                                            <img src={aboutMeData.about_me_image_grads} alt="Grads preview" className="w-16 h-20 object-cover rounded-lg border border-gray-200" />
                                            <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-gray-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1">
                                                <Upload className="h-3.5 w-3.5" /> Subir Nueva Imagen
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const newId = `grads_${Date.now()}`;
                                                            try {
                                                                const { data } = await supabase.storage.from('gallery').upload(newId, file);
                                                                if (data) {
                                                                    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(newId);
                                                                    setAboutMeData(prev => ({ ...prev, about_me_image_grads: publicUrl }));
                                                                }
                                                            } catch (err) {
                                                                const r = new FileReader();
                                                                r.onload = (ev) => {
                                                                    setAboutMeData(prev => ({ ...prev, about_me_image_grads: ev.target?.result as string }));
                                                                };
                                                                r.readAsDataURL(file);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-500">Imagen Retrato Principal (Der.)</label>
                                        <div className="flex items-center gap-4">
                                            <img src={aboutMeData.about_me_image_solo} alt="Solo preview" className="w-16 h-20 object-cover rounded-lg border border-gray-200" />
                                            <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-gray-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1">
                                                <Upload className="h-3.5 w-3.5" /> Subir Nueva Imagen
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const newId = `solo_${Date.now()}`;
                                                            try {
                                                                const { data } = await supabase.storage.from('gallery').upload(newId, file);
                                                                if (data) {
                                                                    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(newId);
                                                                    setAboutMeData(prev => ({ ...prev, about_me_image_solo: publicUrl }));
                                                                }
                                                            } catch (err) {
                                                                const r = new FileReader();
                                                                r.onload = (ev) => {
                                                                    setAboutMeData(prev => ({ ...prev, about_me_image_solo: ev.target?.result as string }));
                                                                };
                                                                r.readAsDataURL(file);
                                                            }
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={async () => {
                                            await handleSaveAboutMe(aboutMeData);
                                        }}
                                        disabled={isSavingAboutMe}
                                        className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                                    >
                                        {isSavingAboutMe ? "Guardando..." : "Guardar Cambios"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeConfigTab === 'destinations' && (
                            /* DESTINATIONS PANEL */
                            <div className="space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800 text-lg">Administrar Destinos</h3>
                                    <button
                                        onClick={() => {
                                            setEditingDestination({ slug: "", title: "", subtitle: "", heroImage: "", overview: "", highlights: [], mustDos: [], tips: [] });
                                            setIsCreatingDestination(true);
                                        }}
                                        className="px-4 py-2 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5"
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Agregar Destino
                                    </button>
                                </div>

                                {/* Destination edit form overlay / block */}
                                {(isCreatingDestination || editingDestination) && (
                                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl animate-in slide-in-from-top duration-200 space-y-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-gray-800 text-sm">{isCreatingDestination ? "Nuevo Destino" : `Editar Destino: ${editingDestination?.title}`}</h4>
                                            <button onClick={() => { setEditingDestination(null); setIsCreatingDestination(false); }} className="text-gray-400 hover:text-gray-600">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Slug (Ruta / ID)</label>
                                                <input
                                                    type="text"
                                                    value={editingDestination?.slug || ""}
                                                    onChange={(e) => setEditingDestination(prev => prev ? { ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') } : null)}
                                                    className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium"
                                                    placeholder="Ej: disney-world"
                                                    disabled={!isCreatingDestination}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Título</label>
                                                <input
                                                    type="text"
                                                    value={editingDestination?.title || ""}
                                                    onChange={(e) => setEditingDestination(prev => prev ? { ...prev, title: e.target.value } : null)}
                                                    className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium"
                                                    placeholder="Ej: Walt Disney World"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Subtítulo</label>
                                                <input
                                                    type="text"
                                                    value={editingDestination?.subtitle || ""}
                                                    onChange={(e) => setEditingDestination(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                                                    className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium"
                                                    placeholder="Ej: El lugar más mágico de la Tierra"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="md:col-span-2 space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Overview / Resumen</label>
                                                <textarea
                                                    value={editingDestination?.overview || ""}
                                                    onChange={(e) => setEditingDestination(prev => prev ? { ...prev, overview: e.target.value } : null)}
                                                    className="w-full p-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium h-24 resize-none"
                                                    placeholder="Describe el destino brevemente..."
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Imagen de Portada (Hero Image)</label>
                                                <div className="flex items-center gap-2">
                                                    {editingDestination?.heroImage && (
                                                        <img src={editingDestination.heroImage} className="w-12 h-12 object-cover rounded-xl border" />
                                                    )}
                                                    <label className="flex-1 h-10 px-3.5 rounded-xl border border-gray-300 border-dashed hover:border-violet-450 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-white">
                                                        <Upload className="h-3.5 w-3.5 text-gray-400" />
                                                        <span className="text-xs text-gray-500 font-medium truncate">Seleccionar imagen</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    setSelectedFiles(prev => ({ ...prev, [`dest_${editingDestination?.slug}`]: file }));
                                                                    const r = new FileReader();
                                                                    r.onload = (ev) => {
                                                                        setEditingDestination(prev => prev ? { ...prev, heroImage: ev.target?.result as string } : null);
                                                                    };
                                                                    r.readAsDataURL(file);
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Highlight, tips, must-dos lists fields inside form */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-200 pt-4">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-500">Imperdibles (Uno por línea)</label>
                                                <textarea
                                                    value={editingDestination?.mustDos.join('\n') || ""}
                                                    onChange={(e) => setEditingDestination(prev => prev ? { ...prev, mustDos: e.target.value.split('\n').filter(s => s.trim()) } : null)}
                                                    className="w-full p-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium h-40"
                                                    placeholder="Espectáculo de fuegos artificiales..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-500">Tips Expertos (Uno por línea)</label>
                                                <textarea
                                                    value={editingDestination?.tips.join('\n') || ""}
                                                    onChange={(e) => setEditingDestination(prev => prev ? { ...prev, tips: e.target.value.split('\n').filter(s => s.trim()) } : null)}
                                                    className="w-full p-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium h-40"
                                                    placeholder="Reserva tus pases a las 7 AM..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold text-gray-500">Destacados (JSON highlights)</label>
                                                <span className="text-[10px] text-gray-400 block pb-1">Configurado como array. Escribe un título y descripción general.</span>
                                                <textarea
                                                    value={JSON.stringify(editingDestination?.highlights, null, 2) || "[]"}
                                                    onChange={(e) => {
                                                        try {
                                                            const arr = JSON.parse(e.target.value);
                                                            if (Array.isArray(arr)) {
                                                                setEditingDestination(prev => prev ? { ...prev, highlights: arr } : null);
                                                            }
                                                        } catch (err) {}
                                                    }}
                                                    className="w-full p-3.5 rounded-xl border border-gray-300 font-mono text-[10px] text-gray-800 h-40"
                                                    placeholder='[\n  {\n    "title": "Magic Kingdom",\n    "description": "Detalle",\n    "icon": "castle"\n  }\n]'
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                                            <button
                                                onClick={() => { setEditingDestination(null); setIsCreatingDestination(false); }}
                                                className="px-4 py-2 text-slate-500 hover:text-slate-700 bg-slate-200/60 hover:bg-slate-200 text-xs font-bold rounded-xl"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (!editingDestination?.slug || !editingDestination.title) {
                                                        alert("El slug y título del destino son requeridos.");
                                                        return;
                                                    }
                                                    const imageFile = selectedFiles[`dest_${editingDestination.slug}`] || null;
                                                    await handleSaveDestination(editingDestination, imageFile);
                                                    setEditingDestination(null);
                                                    setIsCreatingDestination(false);
                                                }}
                                                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-sm"
                                            >
                                                Guardar Destino
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {destinationsList.map((dest) => (
                                        <div key={dest.slug} className="bg-slate-50 border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group">
                                            <div className="relative h-36 bg-gray-200 overflow-hidden">
                                                <img src={dest.heroImage} alt={dest.title} className="object-cover w-full h-full" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                                <div className="absolute bottom-3 left-3 text-white">
                                                    <h4 className="font-bold text-sm">{dest.title}</h4>
                                                    <p className="text-[10px] text-white/80">{dest.subtitle}</p>
                                                </div>
                                            </div>
                                            <div className="p-4 flex-grow flex flex-col justify-between">
                                                <p className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">{dest.overview}</p>
                                                
                                                <div className="flex items-center justify-between border-t border-gray-200/80 pt-3 mt-auto">
                                                    <span className="text-[10px] text-gray-400 font-mono">slug: /{dest.slug}</span>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => setEditingDestination(dest)}
                                                            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold transition-all text-xs cursor-pointer"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteDestination(dest.slug)}
                                                            className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 font-bold transition-all text-xs cursor-pointer"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeConfigTab === 'blog' && (
                            /* BLOG PANEL */
                            <div className="space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800 text-lg">Publicaciones del Blog</h3>
                                    <button
                                        onClick={() => {
                                            setEditingBlogPost({ id: "", slug: "", title: "", excerpt: "", content: "", date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }), readTime: "5 min de lectura", image: "", category: "Tips" });
                                            setIsCreatingBlogPost(true);
                                        }}
                                        className="px-4 py-2 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5"
                                    >
                                        <Plus className="h-3.5 w-3.5" /> Agregar Artículo
                                    </button>
                                </div>

                                {/* Blog edit form overlay / block */}
                                {(isCreatingBlogPost || editingBlogPost) && (
                                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl animate-in slide-in-from-top duration-200 space-y-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-gray-800 text-sm">{isCreatingBlogPost ? "Nuevo Artículo" : `Editar Artículo: ${editingBlogPost?.title}`}</h4>
                                            <button onClick={() => { setEditingBlogPost(null); setIsCreatingBlogPost(false); }} className="text-gray-400 hover:text-gray-600">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Slug único (Ruta / URL)</label>
                                                <input
                                                    type="text"
                                                    value={editingBlogPost?.slug || ""}
                                                    onChange={(e) => setEditingBlogPost(prev => prev ? { ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') } : null)}
                                                    className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium"
                                                    placeholder="Ej: mi-guia-magica"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Título del Artículo</label>
                                                <input
                                                    type="text"
                                                    value={editingBlogPost?.title || ""}
                                                    onChange={(e) => setEditingBlogPost(prev => prev ? { ...prev, title: e.target.value } : null)}
                                                    className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium"
                                                    placeholder="Ej: Cómo ahorrar en tu viaje"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Categoría</label>
                                                <input
                                                    type="text"
                                                    value={editingBlogPost?.category || ""}
                                                    onChange={(e) => setEditingBlogPost(prev => prev ? { ...prev, category: e.target.value } : null)}
                                                    className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium"
                                                    placeholder="Ej: Tips Expertos"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Fecha de Publicación</label>
                                                <input
                                                    type="text"
                                                    value={editingBlogPost?.date || ""}
                                                    onChange={(e) => setEditingBlogPost(prev => prev ? { ...prev, date: e.target.value } : null)}
                                                    className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium"
                                                    placeholder="Ej: 10 Dic, 2025"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Tiempo de Lectura</label>
                                                <input
                                                    type="text"
                                                    value={editingBlogPost?.readTime || ""}
                                                    onChange={(e) => setEditingBlogPost(prev => prev ? { ...prev, readTime: e.target.value } : null)}
                                                    className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium"
                                                    placeholder="Ej: 5 min de lectura"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-xs font-bold text-gray-500">Imagen de Cabecera</label>
                                                <div className="flex items-center gap-2">
                                                    {editingBlogPost?.image && (
                                                        <img src={editingBlogPost.image} className="w-12 h-12 object-cover rounded-xl border" />
                                                    )}
                                                    <label className="flex-1 h-10 px-3.5 rounded-xl border border-gray-300 border-dashed hover:border-violet-450 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-white">
                                                        <Upload className="h-3.5 w-3.5 text-gray-400" />
                                                        <span className="text-xs text-gray-500 font-medium truncate">Seleccionar portada</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    setSelectedFiles(prev => ({ ...prev, [`blog_${editingBlogPost?.slug}`]: file }));
                                                                    const r = new FileReader();
                                                                    r.onload = (ev) => {
                                                                        setEditingBlogPost(prev => prev ? { ...prev, image: ev.target?.result as string } : null);
                                                                    };
                                                                    r.readAsDataURL(file);
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-gray-500">Extracto / Descripción Corta</label>
                                            <input
                                                type="text"
                                                value={editingBlogPost?.excerpt || ""}
                                                onChange={(e) => setEditingBlogPost(prev => prev ? { ...prev, excerpt: e.target.value } : null)}
                                                className="w-full h-10 px-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-medium"
                                                placeholder="Un breve resumen de una sola línea sobre lo que trata el post..."
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="block text-xs font-bold text-gray-500">Contenido del Artículo (Cuerpo HTML)</label>
                                            <span className="text-[10px] text-gray-400 block pb-1">Puedes escribir etiquetas HTML como &lt;p&gt;, &lt;h3&gt;, &lt;strong&gt;, etc. para dar formato al artículo.</span>
                                            <textarea
                                                value={editingBlogPost?.content || ""}
                                                onChange={(e) => setEditingBlogPost(prev => prev ? { ...prev, content: e.target.value } : null)}
                                                className="w-full p-3.5 rounded-xl border border-gray-300 text-xs text-gray-800 font-mono h-60"
                                                placeholder="<p>Escribe el contenido de tu post aquí...</p>"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                                            <button
                                                onClick={() => { setEditingBlogPost(null); setIsCreatingBlogPost(false); }}
                                                className="px-4 py-2 text-slate-500 hover:text-slate-700 bg-slate-200/60 hover:bg-slate-200 text-xs font-bold rounded-xl"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (!editingBlogPost?.slug || !editingBlogPost.title || !editingBlogPost.content) {
                                                        alert("El slug, título y contenido del post son requeridos.");
                                                        return;
                                                    }
                                                    const imageFile = selectedFiles[`blog_${editingBlogPost.slug}`] || null;
                                                    await handleSaveBlogPost(editingBlogPost, imageFile);
                                                    setEditingBlogPost(null);
                                                    setIsCreatingBlogPost(false);
                                                }}
                                                className="px-4 py-2 bg-violet-600 hover:bg-violet-750 text-white text-xs font-bold rounded-xl shadow-sm"
                                            >
                                                Guardar Artículo
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {blogPostsList.map((post) => (
                                        <div key={post.slug} className="bg-slate-50 border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group animate-in fade-in duration-200">
                                            <div className="relative h-36 bg-gray-200 overflow-hidden">
                                                <img src={post.image} alt={post.title} className="object-cover w-full h-full" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                                <div className="absolute bottom-3 left-3 text-white">
                                                    <span className="bg-primary/20 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase mr-2">{post.category}</span>
                                                    <h4 className="font-bold text-sm mt-1">{post.title}</h4>
                                                </div>
                                            </div>
                                            <div className="p-4 flex-grow flex flex-col justify-between">
                                                <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>
                                                
                                                <div className="flex items-center justify-between border-t border-gray-200/80 pt-3 mt-auto">
                                                    <span className="text-[10px] text-gray-400">{post.date} • {post.readTime}</span>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => setEditingBlogPost(post)}
                                                            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold transition-all text-xs cursor-pointer"
                                                        >
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBlogPost(post.id)}
                                                            className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-600 font-bold transition-all text-xs cursor-pointer"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Board Views (Sales, Post-Sales, Lost Leads) */
                <>
                    {/* Back navigation */}
                    <button
                        onClick={() => setView('portal')}
                        className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary transition-colors bg-white px-3 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md"
                    >
                        <ArrowLeft className="h-4 w-4" /> Volver al Portal
                    </button>

                    {/* Top Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                {view === 'sales' && 'Manejo de Ventas'}
                                {view === 'post-sales' && 'Manejo de Post Venta'}
                                {view === 'lost' && 'Leads Perdidos'}
                            </h1>
                            <p className="text-gray-500">
                                {view === 'sales' && 'Prospectos entrantes, contactos iniciales y cotizaciones.'}
                                {view === 'post-sales' && 'Ventas ganadas, reservas y seguimiento.'}
                                {view === 'lost' && 'Oportunidades de venta que no se concretaron.'}
                            </p>
                        </div>

                        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-56">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar cliente..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white"
                                />
                            </div>

                            {/* Sorting selector (only visible for Kanban boards) */}
                            {view !== 'lost' && (
                                <div className="flex items-center gap-1.5 border border-gray-300 rounded-full px-3 h-10 bg-white shadow-sm">
                                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Ordenar:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        className="text-xs font-semibold text-gray-700 outline-none cursor-pointer bg-transparent pr-1"
                                    >
                                        <option value="created_at">Fecha Registro</option>
                                        <option value="check_in">Fecha Check-in</option>
                                        <option value="probability">Probabilidad</option>
                                    </select>
                                    <button
                                        onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                        className="text-gray-500 hover:text-primary transition-colors text-xs font-bold pl-1.5 border-l border-gray-200"
                                        title="Cambiar dirección de ordenamiento"
                                    >
                                        {sortOrder === 'asc' ? '▲' : '▼'}
                                    </button>
                                </div>
                            )}

                            {/* Excel download button */}
                            <button
                                onClick={handleExportCSV}
                                className="h-10 px-4 border border-green-600 text-green-700 hover:bg-green-50 rounded-full font-medium text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Descargar Excel
                            </button>

                            <button
                                onClick={() => setIsCreating(true)}
                                className="h-10 px-4 bg-primary text-white rounded-full font-medium text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <span className="text-xl leading-none">+</span> Nuevo Lead
                            </button>
                        </div>
                    </div>

                    {/* Mobile Tabs */}
                    {view !== 'lost' && (
                        <div className="flex md:hidden overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
                            {activeStatuses.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => setActiveTab(status.value)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                                        activeTab === status.value
                                            ? "text-white border-transparent shadow-md"
                                            : "bg-white border-gray-200 text-gray-600"
                                    )}
                                    style={activeTab === status.value ? { 
                                        backgroundColor: 
                                            status.value === 'new' ? '#3b82f6' : 
                                            status.value === 'contacted' ? '#eab308' : 
                                            status.value === 'proposal' ? '#a855f7' : 
                                            status.value === 'won' ? '#10b981' : 
                                            status.value === 'reservation_60_plus' ? '#6366f1' : 
                                            status.value === 'reservation_60_minus' ? '#ec4899' : 
                                            status.value === 'disney_reserved' ? '#06b6d4' : 
                                            status.value === 'trip_completed' ? '#14b8a6' : 
                                            '#ef4444' 
                                    } : {}}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {view === 'lost' ? (
                        /* Lost Leads List View */
                        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                                            <th className="p-4">Cliente</th>
                                            <th className="p-4">Destino / Viajeros</th>
                                            <th className="p-4">Registro</th>
                                            <th className="p-4">Notas</th>
                                            <th className="p-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredAndSortedLeads
                                            .filter(l => l.status === 'lost')
                                            .map((lead) => (
                                                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-bold text-gray-900 cursor-pointer hover:text-primary" onClick={() => setSelectedLead(lead)}>
                                                            {lead.client_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{lead.email}</div>
                                                        <div className="text-xs text-gray-500">{lead.phone}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-medium text-gray-700">{lead.destination}</div>
                                                        <div className="text-xs text-gray-500">{lead.travelers}</div>
                                                    </td>
                                                    <td className="p-4 text-xs text-gray-500">
                                                        {new Date(lead.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4 max-w-xs">
                                                        {lead.notes && (
                                                            <div className="text-xs text-gray-500 truncate" title={lead.notes}>
                                                                Cliente: "{lead.notes}"
                                                            </div>
                                                        )}
                                                        {lead.admin_notes && (
                                                            <div className="text-xs text-purple-700 font-semibold truncate" title={lead.admin_notes}>
                                                                Interno: "{lead.admin_notes}"
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => setSelectedLead(lead)}
                                                            className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-bold rounded-full transition-colors"
                                                        >
                                                            Detalles
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(lead.id, 'new')}
                                                            className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary hover:text-white text-xs font-bold rounded-full transition-colors"
                                                        >
                                                            Reabrir
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        {filteredAndSortedLeads.filter(l => l.status === 'lost').length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="p-10 text-center text-gray-400">
                                                    No hay leads perdidos en este momento.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        /* Kanban Board for Sales & Post-Sales */
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="flex gap-4 overflow-hidden w-full h-[calc(100vh-220px)] min-h-[500px]">
                                {leadsByStatus.map((column) => (
                                    <div
                                        key={column.value}
                                        className={cn(
                                            "flex-1 min-w-0 flex-col bg-gray-50/50 rounded-xl border border-gray-100 transition-all",
                                            activeTab === column.value ? "flex" : "hidden md:flex"
                                        )}
                                    >
                                        {/* Column Header */}
                                        <div className={`p-3 rounded-t-xl border-b-2 ${column.color} bg-white flex justify-between items-center mb-2 shadow-sm shrink-0`}>
                                            <h3 className="font-bold text-xs lg:text-sm uppercase tracking-wider truncate text-gray-700">{column.label}</h3>
                                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
                                                {column.items.length}
                                            </span>
                                        </div>

                                        {/* Cards Container */}
                                        <Droppable droppableId={column.value}>
                                            {(provided, snapshot) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className={cn(
                                                        "flex-1 space-y-3 p-2 overflow-y-auto custom-scrollbar",
                                                        snapshot.isDraggingOver ? "bg-blue-50/50 ring-2 ring-primary/10 transition-colors" : ""
                                                    )}
                                                >
                                                    {column.items.map((lead, index) => (
                                                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={{
                                                                        ...provided.draggableProps.style,
                                                                    }}
                                                                >
                                                                    <motion.div
                                                                        layoutId={lead.id}
                                                                        onClick={() => {
                                                                            setSelectedLead(lead);
                                                                            setIsEditing(false);
                                                                        }}
                                                                        className={cn(
                                                                            "bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:border-primary/40 group relative overflow-hidden",
                                                                            snapshot.isDragging ? "shadow-2xl rotate-2 scale-105 z-50 ring-2 ring-primary" : ""
                                                                        )}
                                                                    >
                                                                        {/* Status Stripe */}
                                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${column.color.replace('border-', 'bg-')}`} style={{ backgroundColor: column.value === 'won' ? '#10b981' : column.value === 'reservation_60_plus' ? '#6366f1' : column.value === 'reservation_60_minus' ? '#ec4899' : column.value === 'disney_reserved' ? '#06b6d4' : column.value === 'trip_completed' ? '#14b8a6' : undefined }} />

                                                                        <div className="pl-2">
                                                                            <div className="flex justify-between items-start mb-2">
                                                                                <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors line-clamp-1">{lead.client_name}</h4>
                                                                                <span className="text-[10px] text-gray-400 shrink-0 ml-1">{new Date(lead.created_at).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}</span>
                                                                            </div>
                                                                            <div className="space-y-1 mb-2">
                                                                                <div className="flex items-center text-[10px] text-gray-500">
                                                                                    <User className="h-3 w-3 mr-1.5 shrink-0" />
                                                                                    <span className="truncate">{lead.travelers}</span>
                                                                                </div>
                                                                                <div className="flex items-center text-[10px] text-gray-500">
                                                                                    <MapPinIcon className="h-3 w-3 mr-1.5 shrink-0" />
                                                                                    <span className="truncate">{lead.destination}</span>
                                                                                </div>
                                                                                <div className="flex items-center text-[10px] text-gray-500">
                                                                                    <Calendar className="h-3 w-3 mr-1.5 shrink-0" />
                                                                                    <span className="truncate">
                                                                                        {lead.check_in && lead.check_out 
                                                                                            ? `${lead.check_in} al ${lead.check_out}` 
                                                                                            : lead.dates || 'Sin fechas'}
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            {lead.status === 'proposal' && lead.probability !== undefined && lead.probability !== null && (
                                                                                <div className="mt-2 flex items-center">
                                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                                                                        🎯 Probabilidad: {lead.probability}%
                                                                                    </span>
                                                                                </div>
                                                                            )}

                                                                            {lead.admin_notes && (
                                                                                <div className="mt-2 pt-2 border-t border-gray-50">
                                                                                    <p className="text-[10px] text-gray-400 italic line-clamp-1">"{lead.admin_notes}"</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </motion.div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}

                                                    {column.items.length === 0 && !snapshot.isDraggingOver && (
                                                        <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs text-center p-4">
                                                            Sin Leads en esta etapa
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                ))}
                            </div>
                        </DragDropContext>
                    )}
                </>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedLead && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                                        {selectedLead.client_name}
                                    </h2>
                                    <p className="text-sm text-gray-500 flex items-center mt-1">
                                        Creado el {new Date(selectedLead.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedLead(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-6 w-6 text-gray-400" />
                                </button>
                            </div>

                            {/* Tab selection in Read Mode */}
                            {!isEditing && (
                                <div className="flex border-b border-gray-100 px-6 bg-white shrink-0">
                                    <button
                                        onClick={() => setDetailModalTab('info')}
                                        className={cn(
                                            "py-3 text-sm font-bold border-b-2 px-4 transition-all",
                                            detailModalTab === 'info'
                                                ? "border-primary text-primary"
                                                : "border-transparent text-gray-500 hover:text-gray-700"
                                        )}
                                        type="button"
                                    >
                                        Información General
                                    </button>
                                    <button
                                        onClick={() => setDetailModalTab('tasks')}
                                        className={cn(
                                            "py-3 text-sm font-bold border-b-2 px-4 transition-all flex items-center gap-1.5",
                                            detailModalTab === 'tasks'
                                                ? "border-primary text-primary"
                                                : "border-transparent text-gray-500 hover:text-gray-700"
                                        )}
                                        type="button"
                                    >
                                        Seguimiento ({tasks.filter(t => t.lead_id === selectedLead.id).length})
                                    </button>
                                </div>
                            )}

                            {isEditing ? (
                                <form onSubmit={handleSaveEdit} className="flex flex-col min-h-0">
                                    {/* Edit Mode Body */}
                                    <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)] text-sm">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h3 className="font-bold text-gray-900 border-b pb-2">Datos del Cliente</h3>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Nombre Completo</label>
                                                    <input required name="client_name" type="text" defaultValue={selectedLead.client_name} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                                                    <input required name="email" type="text" defaultValue={selectedLead.email} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
                                                    <input name="phone" type="text" defaultValue={selectedLead.phone} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Etapa del Lead</label>
                                                    <select name="status" defaultValue={selectedLead.status} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                                                        {LEAD_STATUSES.map(status => (
                                                            <option key={status.value} value={status.value}>{status.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="font-bold text-gray-900 border-b pb-2">Detalles del Viaje</h3>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Destino</label>
                                                    <input name="destination" type="text" defaultValue={selectedLead.destination} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Viajeros</label>
                                                    <input name="travelers" type="text" defaultValue={selectedLead.travelers} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Check-In</label>
                                                        <input name="check_in" type="date" defaultValue={selectedLead.check_in || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Check-Out</label>
                                                        <input name="check_out" type="date" defaultValue={selectedLead.check_out || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Clasificación</label>
                                                        <select name="provider_classification" defaultValue={selectedLead.provider_classification || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                                                            <option value="">Ninguno</option>
                                                            <option value="Paquetes Disney">Paquetes Disney</option>
                                                            <option value="Crucero Disney">Crucero Disney</option>
                                                            <option value="Otros">Otros</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">Booking/Ref #</label>
                                                        <input name="booking_reference" type="text" defaultValue={selectedLead.booking_reference || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-bold text-gray-900 border-b pb-2">Información Financiera</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Monto Estimado</label>
                                                    <input name="estimated_sale_amount" type="number" step="any" defaultValue={selectedLead.estimated_sale_amount || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" placeholder="0.00" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Precio Final</label>
                                                    <input name="price" type="number" step="any" defaultValue={selectedLead.price || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" placeholder="0.00" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Comisión</label>
                                                    <input name="commission" type="number" step="any" defaultValue={selectedLead.commission || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" placeholder="0.00" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Status de Pago</label>
                                                    <select name="payment_status" defaultValue={selectedLead.payment_status || 'Pendiente'} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                                                        <option value="Pendiente">Pendiente</option>
                                                        <option value="Pagado">Pagado</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Fecha Envío Cot.</label>
                                                    <input name="quote_sent_date" type="date" defaultValue={selectedLead.quote_sent_date || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Probabilidad (%)</label>
                                                    <input name="probability" type="number" min="0" max="100" defaultValue={selectedLead.probability || ''} className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" placeholder="e.g. 80" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1 font-bold text-gray-900">Notas del Cliente</label>
                                                <textarea name="notes" rows={4} defaultValue={selectedLead.notes} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1 font-bold text-gray-900">Notas Administrativas</label>
                                                <textarea name="admin_notes" rows={4} defaultValue={selectedLead.admin_notes || ''} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white" placeholder="Notas internas..." />
                                            </div>
                                        </div>

                                        {/* Centro de Recursos Config */}
                                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 mt-6">
                                            <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                                                🔒 Centro de Recursos
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <input 
                                                        type="checkbox" 
                                                        name="resource_access_enabled" 
                                                        id="resource_access_enabled"
                                                        defaultChecked={selectedLead.resource_access_enabled}
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <label htmlFor="resource_access_enabled" className="text-sm font-semibold text-slate-700">
                                                        Habilitar Centro de Recursos
                                                    </label>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">PIN de Acceso (4 dígitos)</label>
                                                        <input 
                                                            type="text" 
                                                            name="resource_pin" 
                                                            id="edit_resource_pin"
                                                            maxLength={4}
                                                            placeholder="Ej. 1234"
                                                            defaultValue={selectedLead.resource_pin || ''}
                                                            className="w-full p-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white text-sm font-mono tracking-widest"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newPin = Math.floor(1000 + Math.random() * 9000).toString();
                                                            const pinInput = document.getElementById('edit_resource_pin') as HTMLInputElement;
                                                            if (pinInput) pinInput.value = newPin;
                                                        }}
                                                        className="mt-5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-xl shadow-sm transition-colors cursor-pointer"
                                                    >
                                                        Generar PIN
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Secciones Permitidas</span>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                                                        <input 
                                                            type="checkbox" 
                                                            name="resource_wdw" 
                                                            defaultChecked={selectedLead.resource_wdw}
                                                            className="h-4 w-4 text-primary focus:ring-primary rounded" 
                                                        />
                                                        <span className="text-xs font-bold text-gray-700">Disney World</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                                                        <input 
                                                            type="checkbox" 
                                                            name="resource_dl" 
                                                            defaultChecked={selectedLead.resource_dl}
                                                            className="h-4 w-4 text-primary focus:ring-primary rounded" 
                                                        />
                                                        <span className="text-xs font-bold text-gray-700">Disneyland</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                                                        <input 
                                                            type="checkbox" 
                                                            name="resource_dcl" 
                                                            defaultChecked={selectedLead.resource_dcl}
                                                            className="h-4 w-4 text-primary focus:ring-primary rounded" 
                                                        />
                                                        <span className="text-xs font-bold text-gray-700">Disney Cruise</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Edit Mode Footer */}
                                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-3xl">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors shadow-md"
                                        >
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {detailModalTab === 'tasks' ? (
                                        /* Tasks Tab in Modal */
                                        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                                            <div className="flex justify-between items-center pb-2 border-b">
                                                <h3 className="font-bold text-gray-900 text-sm">Tareas de Seguimiento</h3>
                                                <button
                                                    onClick={() => {
                                                        setEditingTask(null);
                                                        setIsCreatingTask(true);
                                                    }}
                                                    className="px-3 py-1.5 bg-primary text-white hover:bg-primary/90 text-xs font-bold rounded-full transition-colors flex items-center gap-1 shadow-sm"
                                                    type="button"
                                                >
                                                    <Plus className="h-3.5 w-3.5" /> Nueva Tarea
                                                </button>
                                            </div>

                                            {(() => {
                                                const clientTasks = tasks.filter(t => t.lead_id === selectedLead.id);
                                                if (clientTasks.length === 0) {
                                                    return (
                                                        <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                                                            <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                            <h4 className="font-bold text-gray-700 text-xs">Sin tareas asignadas</h4>
                                                            <p className="text-gray-400 text-[10px] mt-0.5">Agrega una tarea de seguimiento para este cliente.</p>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div className="space-y-3">
                                                        {clientTasks.map(task => {
                                                            const statusObj = TASK_STATUSES.find(s => s.value === task.status);
                                                            const todayStr = getLocalYYYYMMDD();
                                                            const isOverdue = task.due_date < todayStr && task.status !== 'completed';

                                                            return (
                                                                <div
                                                                    key={task.id}
                                                                    className={cn(
                                                                        "p-3.5 rounded-xl border transition-all flex items-start gap-3 relative group bg-white text-left",
                                                                        task.status === 'completed'
                                                                            ? "bg-gray-50/50 border-gray-100 opacity-75"
                                                                            : isOverdue
                                                                                ? "border-red-100 hover:border-red-200 bg-red-50/5"
                                                                                : "border-gray-100 hover:border-gray-200"
                                                                    )}
                                                                >
                                                                    {/* Complete Checkbox */}
                                                                    <button
                                                                        onClick={() => handleUpdateTask(task.id, { status: task.status === 'completed' ? 'not_started' : 'completed' })}
                                                                        type="button"
                                                                        className="mt-0.5 text-gray-400 hover:text-green-600 transition-colors shrink-0"
                                                                    >
                                                                        {task.status === 'completed' ? (
                                                                            <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-50" />
                                                                        ) : (
                                                                            <div className="h-5 w-5 rounded-full border-2 border-gray-300 hover:border-green-500 transition-all" />
                                                                        )}
                                                                    </button>

                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-start justify-between gap-2">
                                                                            <h4 className={cn(
                                                                                "font-bold text-gray-950 text-sm line-clamp-1",
                                                                                task.status === 'completed' ? "line-through text-gray-400" : ""
                                                                            )}>
                                                                                {task.title}
                                                                            </h4>
                                                                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-auto bg-white pl-2">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setEditingTask(task);
                                                                                        setIsCreatingTask(true);
                                                                                    }}
                                                                                    type="button"
                                                                                    className="p-1 hover:bg-gray-100 rounded text-gray-550 hover:text-primary transition-all"
                                                                                    title="Editar"
                                                                                >
                                                                                    <Edit className="h-3.5 w-3.5" />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteTask(task.id)}
                                                                                    type="button"
                                                                                    className="p-1 hover:bg-red-50 rounded text-gray-550 hover:text-red-650 transition-all"
                                                                                    title="Eliminar"
                                                                                >
                                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                                </button>
                                                                            </div>
                                                                        </div>

                                                                        {task.description && (
                                                                            <p className={cn(
                                                                                "text-gray-500 text-xs mt-1.5 leading-relaxed",
                                                                                task.status === 'completed' ? "text-gray-400" : ""
                                                                            )}>
                                                                                {task.description}
                                                                            </p>
                                                                        )}

                                                                        <div className="flex items-center gap-2 mt-3 text-[10px]">
                                                                            <span className={cn(
                                                                                "inline-flex items-center font-bold px-2 py-0.5 rounded-full border gap-0.5",
                                                                                task.status === 'completed'
                                                                                    ? "bg-green-50 text-green-700 border-green-100"
                                                                                    : isOverdue
                                                                                        ? "bg-red-50 text-red-700 border-red-100"
                                                                                        : "bg-gray-50 text-gray-500 border-gray-100"
                                                                            )}>
                                                                                ⏰ {new Date(task.due_date + 'T00:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                                            </span>

                                                                            <span className={cn(
                                                                                "inline-flex items-center font-bold px-2 py-0.5 rounded-full border",
                                                                                statusObj ? `${statusObj.color} border-current/15` : "bg-gray-50 text-gray-500"
                                                                            )}>
                                                                                {statusObj?.label || task.status}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        /* Read Mode Body */
                                        <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                                        {/* Status Selector */}
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Etapa del Lead</label>
                                            <div className="flex flex-wrap gap-2">
                                                {LEAD_STATUSES.map(status => (
                                                    <button
                                                        key={status.value}
                                                        onClick={() => handleUpdateStatus(selectedLead.id, status.value)}
                                                        className={cn(
                                                            "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                                                            selectedLead.status === status.value
                                                                ? status.color + " border-transparent ring-2 ring-primary/20 ring-offset-2"
                                                                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                                        )}
                                                    >
                                                        {status.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        <User className="h-4 w-4 text-primary" /> Contacto
                                                    </h3>
                                                    <div className="space-y-4 text-sm">
                                                        <div className="flex items-center gap-3">
                                                            <Mail className="h-4 w-4 text-gray-400" />
                                                            <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">{selectedLead.email}</a>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Phone className="h-4 w-4 text-gray-400" />
                                                            <a href={`tel:${selectedLead.phone}`} className="text-blue-600 hover:underline">{selectedLead.phone}</a>

                                                            {/* WhatsApp Button */}
                                                            <a
                                                                href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white text-xs font-bold rounded-full hover:bg-[#128C7E] transition-colors shadow-sm"
                                                            >
                                                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                                </svg>
                                                                WhatsApp
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-primary" /> Detalles del Viaje
                                                    </h3>
                                                    <div className="space-y-3 text-sm">
                                                        <div>
                                                            <span className="text-gray-500 block text-xs">Destino</span>
                                                            <span className="font-medium">{selectedLead.destination}</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Check-In</span>
                                                                <span className="font-medium">{selectedLead.check_in || 'Sin fecha'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Check-Out</span>
                                                                <span className="font-medium">{selectedLead.check_out || 'Sin fecha'}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500 block text-xs">Viajeros</span>
                                                            <span className="font-medium">{selectedLead.travelers}</span>
                                                        </div>
                                                        {selectedLead.provider_classification && (
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Clasificación Proveedor</span>
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                                    {selectedLead.provider_classification}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {selectedLead.booking_reference && (
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Booking / Reference</span>
                                                                <span className="font-mono font-medium text-gray-700">{selectedLead.booking_reference}</span>
                                                            </div>
                                                        )}
                                                        {selectedLead.quote_sent_date && (
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Fecha Envío Cotización</span>
                                                                <span className="font-medium">{selectedLead.quote_sent_date}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Centro de Recursos status card */}
                                                <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        🔒 Centro de Recursos
                                                    </h3>
                                                    <div className="space-y-3 text-sm">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-500 text-xs">Acceso Habilitado</span>
                                                            <span className={cn(
                                                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border",
                                                                selectedLead.resource_access_enabled 
                                                                    ? "bg-green-50 text-green-700 border-green-200" 
                                                                    : "bg-red-50 text-red-700 border-red-200"
                                                            )}>
                                                                {selectedLead.resource_access_enabled ? "Sí" : "No"}
                                                            </span>
                                                        </div>
                                                        {selectedLead.resource_access_enabled && (
                                                            <>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-gray-500 text-xs">PIN de Acceso</span>
                                                                    <span className="font-mono font-bold text-slate-800 bg-white border px-2 py-0.5 rounded text-xs select-all">
                                                                        {selectedLead.resource_pin || "Sin PIN"}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-500 text-xs block mb-1">Secciones Activas</span>
                                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                                        {selectedLead.resource_wdw && (
                                                                            <span className="px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-100 text-[10px] font-bold">Disney World</span>
                                                                        )}
                                                                        {selectedLead.resource_dl && (
                                                                            <span className="px-2 py-0.5 rounded bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100 text-[10px] font-bold">Disneyland</span>
                                                                        )}
                                                                        {selectedLead.resource_dcl && (
                                                                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold">Disney Cruise</span>
                                                                        )}
                                                                        {!selectedLead.resource_wdw && !selectedLead.resource_dl && !selectedLead.resource_dcl && (
                                                                            <span className="text-xs text-gray-400 italic">Ninguna sección activa</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                {/* Financial info */}
                                                <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        💰 Información Financiera
                                                    </h3>
                                                    <div className="space-y-3 text-sm">
                                                        <div>
                                                            <span className="text-gray-500 block text-xs">Monto Estimado de Venta</span>
                                                            <span className="font-semibold text-gray-800 text-base">
                                                                {selectedLead.estimated_sale_amount !== undefined && selectedLead.estimated_sale_amount !== null
                                                                    ? `$${Number(selectedLead.estimated_sale_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                                    : '$0.00'}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Precio Final</span>
                                                                <span className="font-semibold text-gray-800">
                                                                    {selectedLead.price !== undefined && selectedLead.price !== null
                                                                        ? `$${Number(selectedLead.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                                        : '$0.00'}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Comisión</span>
                                                                <span className="font-semibold text-green-700">
                                                                    {selectedLead.commission !== undefined && selectedLead.commission !== null
                                                                        ? `$${Number(selectedLead.commission).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                                                        : '$0.00'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500 block text-xs mb-1">Status de Pago</span>
                                                            {selectedLead.payment_status === 'Pagado' ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                                                    ✓ Pagado
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                                    ⏰ Pendiente
                                                                </span>
                                                            )}
                                                        </div>
                                                        {selectedLead.probability !== undefined && selectedLead.probability !== null && (
                                                            <div>
                                                                <span className="text-gray-500 block text-xs">Probabilidad de Cierre</span>
                                                                <span className="font-bold text-purple-700">{selectedLead.probability}%</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                        Notas del Cliente
                                                    </h3>
                                                    <div className="bg-white border border-gray-200 p-4 rounded-xl text-sm italic text-gray-600 min-h-[80px]">
                                                        "{selectedLead.notes || 'Sin notas del cliente.'}"
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                        Notas Administrativas
                                                    </h3>
                                                    <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-xl text-sm text-gray-700 min-h-[80px]">
                                                        {selectedLead.admin_notes || <span className="text-gray-400 not-italic">Sin notas administrativas. Haz clic en "Editar" abajo para agregar.</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                    {/* Read Mode Footer */}
                                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between gap-3 rounded-b-3xl mt-auto">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteLead(selectedLead.id)}
                                            className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <Trash2 className="h-4 w-4" /> Eliminar Lead
                                        </button>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedLead(null)}
                                                className="px-6 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors shadow-md"
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create Lead Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                <h2 className="text-xl font-bold text-gray-900">Nuevo Lead Manual</h2>
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-6 w-6 text-gray-400" />
                                </button>
                            </div>
                            <form action={handleCreateLead} className="p-6 space-y-4 text-sm">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente *</label>
                                    <input required name="client_name" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ej. Juan Pérez" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input required name="email" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="juan@email.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                        <input name="phone" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="+52..." />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                                        <input name="destination" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ej. Disney World" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Viajeros</label>
                                        <input name="travelers" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Ej. 2 Adultos" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-In</label>
                                        <input name="check_in" type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out</label>
                                        <input name="check_out" type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Clasificación Proveedor</label>
                                        <select name="provider_classification" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                                            <option value="">Seleccionar...</option>
                                            <option value="Paquetes Disney">Paquetes Disney</option>
                                            <option value="Crucero Disney">Crucero Disney</option>
                                            <option value="Otros">Otros</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status de Pago</label>
                                        <select name="payment_status" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                                            <option value="">Seleccionar...</option>
                                            <option value="Pendiente">Pendiente</option>
                                            <option value="Pagado">Pagado</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Monto Estimado</label>
                                        <input name="estimated_sale_amount" type="number" step="any" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Precio Final</label>
                                        <input name="price" type="number" step="any" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Comisión</label>
                                        <input name="commission" type="number" step="any" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Booking/Ref #</label>
                                        <input name="booking_reference" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="12345" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Enviado Cot.</label>
                                        <input name="quote_sent_date" type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Probabilidad (%)</label>
                                        <input name="probability" type="number" min="0" max="100" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. 50" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                                    <textarea name="notes" rows={3} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Detalles adicionales..." />
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all">
                                        Crear Lead
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Task Create/Edit Modal */}
            <AnimatePresence>
                {isCreatingTask && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                                <h3 className="text-base font-bold text-gray-900">
                                    {editingTask ? "Editar Tarea de Seguimiento" : "Nueva Tarea de Seguimiento"}
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsCreatingTask(false);
                                        setEditingTask(null);
                                    }}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                    type="button"
                                >
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const title = formData.get('task_title') as string;
                                    const description = formData.get('task_desc') as string;
                                    const due_date = formData.get('task_due_date') as string;
                                    const status = formData.get('task_status') as TaskStatus;
                                    const lead_id = formData.get('task_lead_id') as string;

                                    if (editingTask) {
                                        await handleUpdateTask(editingTask.id, {
                                            title,
                                            description: description || null,
                                            due_date,
                                            status,
                                            lead_id
                                        });
                                    } else {
                                        await handleCreateTask({
                                            title,
                                            description: description || null,
                                            due_date,
                                            status,
                                            lead_id
                                        });
                                    }
                                    setIsCreatingTask(false);
                                    setEditingTask(null);
                                }}
                                className="p-6 space-y-4 text-sm text-left"
                            >
                                {/* Lead Selector */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cliente / Lead *</label>
                                    {selectedLead ? (
                                        <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 font-bold text-gray-700">
                                            {selectedLead.client_name}
                                            <input type="hidden" name="task_lead_id" value={selectedLead.id} />
                                        </div>
                                    ) : (
                                        <select
                                            name="task_lead_id"
                                            required
                                            defaultValue={editingTask ? editingTask.lead_id : ""}
                                            className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                        >
                                            <option value="" disabled>Selecciona un cliente...</option>
                                            {leads.map(lead => (
                                                <option key={lead.id} value={lead.id}>
                                                    {lead.client_name} ({lead.destination || 'Sin destino'})
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Título / Asunto *</label>
                                    <input
                                        type="text"
                                        name="task_title"
                                        required
                                        placeholder="Ej. Llamar para definir hotel"
                                        defaultValue={editingTask ? editingTask.title : ""}
                                        className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                    />
                                </div>

                                {/* Due Date */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Fecha de Seguimiento *</label>
                                    <input
                                        type="date"
                                        name="task_due_date"
                                        required
                                        defaultValue={editingTask ? editingTask.due_date : getLocalYYYYMMDD()}
                                        className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estado de la Tarea</label>
                                    <select
                                        name="task_status"
                                        defaultValue={editingTask ? editingTask.status : "not_started"}
                                        className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                    >
                                        <option value="not_started">No iniciada</option>
                                        <option value="in_process">En proceso</option>
                                        <option value="completed">Terminada</option>
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Detalles / Notas de Seguimiento</label>
                                    <textarea
                                        name="task_desc"
                                        rows={3}
                                        placeholder="Detalles de lo acordado o por hacer..."
                                        defaultValue={editingTask && editingTask.description ? editingTask.description : ""}
                                        className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreatingTask(false);
                                            setEditingTask(null);
                                        }}
                                        className="px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors shadow-md"
                                    >
                                        {editingTask ? "Guardar" : "Crear Tarea"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MapPinIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
    )
}

function NoteEditor({ initialValue, onSave, onCancel }: { initialValue: string, onSave: (val: string) => void, onCancel: () => void }) {
    const [val, setVal] = useState(initialValue);
    return (
        <div className="space-y-2">
            <textarea
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Escribe notas aquí..."
                autoFocus
            />
            <div className="flex gap-2 justify-end">
                <button onClick={onCancel} className="text-xs text-gray-500 font-medium px-3 py-1 hover:bg-gray-100 rounded-full">Cancelar</button>
                <button onClick={() => onSave(val)} className="text-xs bg-primary text-white font-medium px-3 py-1 rounded-full shadow-sm hover:bg-primary/90">Guardar Nota</button>
            </div>
        </div>
    )
}
