import bcrypt from 'bcrypt';
import prisma from './utils/prisma';
import { faker } from '@faker-js/faker';

async function seed() {
    console.log('🌱 Seeding database with dynamic data...');

    // Clear existing data
    await prisma.payment.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.plan.deleteMany();
    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.discount.deleteMany();
    await prisma.tax.deleteMany();
    await prisma.user.deleteMany();

    // 1. Create Static Admin & Staff
    const hashedPassword = await bcrypt.hash('demo', 10);

    const admin = await prisma.user.create({
        data: {
            name: 'Alex Morgan',
            email: 'admin@subscriptiq.com',
            password: hashedPassword,
            role: 'ADMIN',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
            company: 'SubscriptIQ Inc.',
        },
    });

    const staff = await prisma.user.create({
        data: {
            name: 'Jordan Smith',
            email: 'staff@subscriptiq.com',
            password: hashedPassword,
            role: 'INTERNAL',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            company: 'SubscriptIQ Inc.',
        },
    });

    console.log('✅ Created Admin & Staff');

    // 2. Create Products & Plans
    console.log('Creating polished products...');
    const productData = [
        // Existing Tech Products
        {
            name: 'Premium Noise-Cancelling Headphones',
            description: 'Studio-quality matte black over-ear headphones with active noise cancellation and 30-hour battery life.',
            price: 24999.00,
            image: '/products/headphones.png',
            category: 'Electronics',
            stock: 45
        },
        {
            name: 'Minimalist Steel Smartwatch',
            description: 'Sleek silver stainless steel smartwatch with OLED display, heart rate monitoring, and 7-day battery.',
            price: 16999.00,
            image: '/products/smartwatch.png',
            category: 'Wearables',
            stock: 120
        },
        {
            name: 'Ergonomic Designer Office Chair',
            description: 'High-end charcoal grey ergonomic chair with lumbar support and chrome base. Perfect for modern offices.',
            price: 45999.00,
            image: '/products/chair.png',
            category: 'Furniture',
            stock: 15
        },
        {
            name: 'Artisanal Coffee Subscription',
            description: 'Monthly delivery of single-origin roasted coffee beans. Gold-label packaging with notes of chocolate and berry.',
            price: 1999.00,
            image: '/products/coffee.png',
            category: 'Food & Beverage',
            stock: 500
        },
        {
            name: 'Smart Home Hub Pro',
            description: 'Centralized smart home controller with voice assistant and ambient blue ring light. Compatible with all major protocols.',
            price: 9999.00,
            image: '/products/hub.png',
            category: 'Smart Home',
            stock: 85
        },
        // --- Subscription Management & SaaS ---
        {
            name: "Enterprise CRM Suite",
            description: "Complete customer relationship management solution with AI-driven insights and automation.",
            price: 7499.00,
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "SaaS",
            stock: 1000
        },
        {
            name: "Cloud Storage Pro",
            description: "2TB of secure cloud storage with advanced collaboration features and version history.",
            price: 1999.00,
            image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "SaaS",
            stock: 5000
        },
        {
            name: "Project Management Tool",
            description: "Streamline your team's workflow with task boards, timelines, and goal tracking.",
            price: 2499.00,
            image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "SaaS",
            stock: 2000
        },
        {
            name: "Marketing Analytics Dashboard",
            description: "Real-time analytics for all your marketing channels in one place.",
            price: 4999.00,
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "SaaS",
            stock: 1500
        },
        {
            name: "HR Management System",
            description: "Automate payroll, benefits, and employee onboarding.",
            price: 6499.00,
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "SaaS",
            stock: 800
        },
        // --- Add-ons ---
        {
            name: "Priority Support",
            description: "24/7 dedicated support line and 1-hour response time guarantee.",
            price: 1499.00,
            image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Add-on",
            stock: 9999
        },
        {
            name: "Advanced Security Pack",
            description: "Enhanced encryption, SSO, and audit logs for enterprise security.",
            price: 3499.00,
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Add-on",
            stock: 9999
        },
        {
            name: "API Access",
            description: "Full access to our REST API for custom integrations.",
            price: 1999.00,
            image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Add-on",
            stock: 9999
        },
        {
            name: "White Labeling",
            description: "Remove our branding and use your own logo and domain.",
            price: 9999.00,
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Add-on",
            stock: 50
        },
        // --- StyleZone Products ---
        {
            name: "Urban Winter Jacket",
            description: "Waterproof winter jacket with thermal lining. Perfect for cold weather.",
            price: 7999.00,
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Fashion",
            stock: 100
        },
        {
            name: "Designer Leather Handbag",
            description: "Genuine leather handbag with multiple compartments and adjustable strap.",
            price: 12999.00,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Accessories",
            stock: 50
        },
        {
            name: "Pro Running Shoes",
            description: "Lightweight running shoes with advanced cushioning technology.",
            price: 9999.00,
            image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Sportswear",
            stock: 80
        },
        {
            name: "Classic Denim Overalls",
            description: "Durable denim overalls with an adjustable fit and classic styling.",
            price: 4999.00,
            image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Apparel",
            stock: 200
        },
        {
            name: "Minimalist Gold Watch",
            description: "Elegant gold-plated watch with a minimalist face and leather strap.",
            price: 16999.00,
            image: "https://images.unsplash.com/photo-1524333865941-24502d702eca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Accessories",
            stock: 30
        },
        {
            name: "Silk Floral Scarf",
            description: "Hand-painted silk scarf with a vibrant floral pattern.",
            price: 2999.00,
            image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Accessories",
            stock: 150
        },
        {
            name: "Premium Cotton T-Shirt",
            description: "Ultra-soft 100% organic cotton t-shirt with a modern fit.",
            price: 1999.00,
            image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Apparel",
            stock: 500
        },
        {
            name: "Polarized Aviators",
            description: "Classic aviator sunglasses with polarized lenses and UV protection.",
            price: 6999.00,
            image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Eyewear",
            stock: 60
        },
        // --- High-End Tech ---
        {
            name: "Professional Mirrorless Camera Kit",
            description: "Full-frame 24MP sensor with 24-70mm lens. 4K video recording and 5-axis image stabilization.",
            price: 159999.00,
            image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Electronics",
            stock: 12
        },
        {
            name: "Ultra-Wide Gaming Monitor",
            description: "34-inch curved monitor with 144Hz refresh rate and 1ms response time. Immersive gaming experience.",
            price: 54999.00,
            image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Electronics",
            stock: 25
        },
        {
            name: "Wireless Mechanical Keyboard",
            description: "Hot-swappable switches, RGB backlighting, and aluminum chassis. Compatible with Mac and Windows.",
            price: 12999.00,
            image: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Electronics",
            stock: 60
        },
        {
            name: "Portable Bluetooth Speaker",
            description: "Waterproof speaker with 360-degree sound and 12-hour battery life. Perfect for outdoor adventures.",
            price: 6999.00,
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Electronics",
            stock: 150
        },

        // --- Home & Lifestyle ---
        {
            name: "Mid-Century Modern Sofa",
            description: "Velvet upholstery with solid wood legs. Compact design fits perfectly in apartments.",
            price: 74999.00,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Furniture",
            stock: 10
        },
        {
            name: "Smart Air Purifier",
            description: "HEPA filter removes 99.97% of allergens. App-controlled with real-time air quality monitoring.",
            price: 19999.00,
            image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Home Appliances",
            stock: 40
        },
        {
            name: "Minimalist Desk Lamp",
            description: "LED lamp with adjustable brightness and color temperature. Includes wireless charging base.",
            price: 3999.00,
            image: "https://images.unsplash.com/photo-1534073828943-f801091a7d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Furniture",
            stock: 200
        },
        {
            name: "Ceramic Dinnerware Set",
            description: "16-piece handcrafted ceramic set. Microwave and dishwasher safe.",
            price: 9999.00,
            image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Home & Kitchen",
            stock: 75
        },

        // --- Fashion & Accessories ---
        {
            name: "Classic Trench Coat",
            description: "Timeless beige trench coat made from water-resistant cotton gabardine.",
            price: 18999.00,
            image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Fashion",
            stock: 35
        },
        {
            name: "Leather Chelsea Boots",
            description: "Handcrafted leather boots with durable rubber sole. Stylish and comfortable for daily wear.",
            price: 13999.00,
            image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Footwear",
            stock: 55
        },
        {
            name: "Travel Backpack",
            description: "Water-resistant backpack with laptop compartment and anti-theft zipper.",
            price: 6999.00,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Accessories",
            stock: 120
        },
        {
            name: "Cat-Eye Sunglasses",
            description: "Retro-inspired sunglasses with UV400 protection.",
            price: 4499.00,
            image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Eyewear",
            stock: 90
        },

        // --- Sports & Outdoors ---
        {
            name: "Essential Yoga Mat",
            description: "Non-slip yoga mat made from eco-friendly materials. Includes carrying strap.",
            price: 2999.00,
            image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Generics",
            stock: 300
        },
        {
            name: "Resistance Band Set",
            description: "Set of 5 heavy-duty resistance bands for home workouts.",
            price: 2199.00,
            image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Fitness",
            stock: 250
        },
        {
            name: "Adjustable Dumbbells",
            description: "Pair of adjustable dumbbells ranging from 5 to 52.5 lbs. Space-saving design.",
            price: 29999.00,
            image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Fitness",
            stock: 20
        },
        {
            name: "Trail Running Backpack",
            description: "Hydration vest with multiple pockets for long-distance running.",
            price: 8999.00,
            image: "https://images.unsplash.com/photo-1627885746016-538166c30f40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            category: "Sportswear",
            stock: 45
        }

    ];

    const plans = [];

    for (const p of productData) {
        const product = await prisma.product.create({
            data: {
                name: p.name,
                description: p.description,
                price: p.price,
                imageUrl: p.image, // Now pointing to local public files
                category: p.category,
                stock: p.stock,
                status: 'ACTIVE',
            },
        });

        // Monthly Plan
        const monthlyPlan = await prisma.plan.create({
            data: {
                name: `${p.name} Monthly`,
                productId: product.id,
                billing: 'MONTHLY',
                price: p.price,
                subscribers: 0, // Will update later if needed, or just let dynamic data fill it
                status: 'active',
            },
        });
        plans.push(monthlyPlan);

        // Yearly Plan (2 months free)
        const yearlyPlan = await prisma.plan.create({
            data: {
                name: `${p.name} Annual`,
                productId: product.id,
                billing: 'YEARLY',
                price: p.price * 10,
                subscribers: 0,
                status: 'active',
            },
        });
        plans.push(yearlyPlan);
    }

    console.log('✅ Created Products & Plans');

    // 3. Create Dynamic Customers & Subscriptions
    const customerCount = 50;
    const customers = [];

    for (let i = 0; i < customerCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName }).toLowerCase();
        const company = faker.company.name();

        // Create User (Customer Role)
        const user = await prisma.user.create({
            data: {
                name: `${firstName} ${lastName}`,
                email,
                password: hashedPassword,
                role: 'CUSTOMER',
                avatar: faker.image.avatar(),
                company,
                createdAt: faker.date.past({ years: 1 }),
            },
        });

        // Create Customer Record
        const customer = await prisma.customer.create({
            data: {
                name: user.name,
                email: user.email,
                company: user.company,
                status: faker.helpers.arrayElement(['active', 'active', 'active', 'inactive']),
                totalSpent: 0,
            },
        });
        customers.push(customer);

        // Assign 1-2 Subscriptions
        const subCount = faker.number.int({ min: 1, max: 2 });
        for (let j = 0; j < subCount; j++) {
            const plan = faker.helpers.arrayElement(plans);
            const status = faker.helpers.arrayElement(['ACTIVE', 'ACTIVE', 'ACTIVE', 'PAST_DUE', 'CANCELLED']);
            const startDate = faker.date.past({ years: 1 });
            let endDate = null;

            if (status === 'CANCELLED') {
                endDate = faker.date.between({ from: startDate, to: new Date() });
            }

            const subscription = await prisma.subscription.create({
                data: {
                    customerId: customer.id,
                    planId: plan.id,
                    status: status,
                    startDate: startDate,
                    nextBilling: faker.date.future(),
                    mrr: plan.billing === 'MONTHLY' ? plan.price : plan.price / 12,
                },
            });

            // Generic Invoice Generation (Past)
            const invoiceCount = faker.number.int({ min: 1, max: 6 });
            let spent = 0;

            for (let k = 0; k < invoiceCount; k++) {
                const invDate = faker.date.past({ years: 1 });
                const invStatus = faker.helpers.arrayElement(['PAID', 'PAID', 'PAID', 'PENDING']);

                const invoice = await prisma.invoice.create({
                    data: {
                        subscriptionId: subscription.id,
                        customerId: customer.id,
                        amount: plan.price,
                        status: invStatus,
                        dueDate: faker.date.future({ refDate: invDate }),
                        paidDate: invStatus === 'PAID' ? faker.date.soon({ refDate: invDate }) : null,
                    },
                });

                if (invStatus === 'PAID') {
                    await prisma.payment.create({
                        data: {
                            invoiceId: invoice.id,
                            amount: plan.price,
                            method: faker.helpers.arrayElement(['CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER']),
                            status: 'completed',
                            date: invoice.paidDate!,
                        },
                    });
                    spent += plan.price;
                }
            }

            // Update customer total spent
            await prisma.customer.update({
                where: { id: customer.id },
                data: { totalSpent: { increment: spent } },
            });
        }
    }

    console.log(`✅ Created ${customerCount} Customers with Subscriptions & History`);

    // 4. Create Discounts
    await prisma.discount.create({
        data: {
            name: 'Welcome Offer',
            code: 'WELCOME20',
            type: 'PERCENTAGE',
            value: 20,
            status: 'active',
            usageCount: faker.number.int({ min: 10, max: 100 }),
        },
    });

    console.log('\n🎉 Database seeded successfully!');
    console.log('📝 Demo Accounts:');
    console.log('   Admin: admin@subscriptiq.com / demo');
    console.log('   Staff: staff@subscriptiq.com / demo');
    console.log('   Customer: (Created 50 random customers) / demo');
}

seed()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
