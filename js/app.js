// 数据存储键
const STORAGE_KEY = 'reading_notes';
let currentCoverImage = '';
let currentNoteId = null;

// 书籍推荐数据库
const BOOK_RECOMMENDATIONS = [
    {
        id: 'rec1',
        title: '活着',
        author: '余华',
        category: '文学',
        tags: ['人生', '苦难', '坚韧', '生命', '感动'],
        description: '一个人一生的故事，讲述人如何去承受巨大的苦难。',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80'
    },
    {
        id: 'rec2',
        title: '百年孤独',
        author: '加西亚·马尔克斯',
        category: '文学',
        tags: ['魔幻现实主义', '家族', '孤独', '命运', '经典'],
        description: '布恩迪亚家族七代人的传奇故事，魔幻现实主义文学代表作。',
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80'
    },
    {
        id: 'rec3',
        title: '人类简史',
        author: '尤瓦尔·赫拉利',
        category: '历史',
        tags: ['历史', '人类', '进化', '认知', '未来'],
        description: '从认知革命到科学革命，重新审视人类历史。',
        cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&q=80'
    },
    {
        id: 'rec4',
        title: '三体',
        author: '刘慈欣',
        category: '科幻',
        tags: ['科幻', '宇宙', '文明', '未来', '探索'],
        description: '中国科幻巅峰之作，讲述人类文明与三体文明的博弈。',
        cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80'
    },
    {
        id: 'rec5',
        title: '小王子',
        author: '圣埃克苏佩里',
        category: '童话',
        tags: ['成长', '爱', '纯真', '哲理', '经典'],
        description: '献给长成了大人的孩子们，关于爱与责任的寓言。',
        cover: 'https://images.unsplash.com/photo-1633477189729-9290b3261d0a?w=300&q=80'
    },
    {
        id: 'rec6',
        title: '月亮与六便士',
        author: '毛姆',
        category: '文学',
        tags: ['艺术', '理想', '人生', '选择', '追求'],
        description: '一个证券经纪人突然抛弃一切去追寻绘画理想的故事。',
        cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80'
    },
    {
        id: 'rec7',
        title: '沉默的大多数',
        author: '王小波',
        category: '散文',
        tags: ['思考', '批判', '自由', '理性', '杂文'],
        description: '王小波杂文代表作，用幽默的笔触剖析社会现象。',
        cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&q=80'
    },
    {
        id: 'rec8',
        title: '围城',
        author: '钱钟书',
        category: '文学',
        tags: ['讽刺', '婚姻', '知识', '社会', '经典'],
        description: '城外的人想进去，城里的人想出来，人生处处是围城。',
        cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80'
    },
    {
        id: 'rec9',
        title: '挪威的森林',
        author: '村上春树',
        category: '文学',
        tags: ['青春', '爱情', '成长', '孤独', '治愈'],
        description: '一部动人心弦的、平缓舒雅的、略带感伤的恋爱小说。',
        cover: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80'
    },
    {
        id: 'rec10',
        title: '平凡的世界',
        author: '路遥',
        category: '文学',
        tags: ['奋斗', '人生', '时代', '励志', '现实主义'],
        description: '展示了普通人在大时代历史进程中所走过的艰难曲折的道路。',
        cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80'
    },
    {
        id: 'rec11',
        title: '霍乱时期的爱情',
        author: '加西亚·马尔克斯',
        category: '文学',
        tags: ['爱情', '等待', '生命', '执着', '时间'],
        description: '一段跨越半个多世纪的爱情史诗，穷尽了爱情的所有可能性。',
        cover: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=300&q=80'
    },
    {
        id: 'rec12',
        title: '局外人',
        author: '加缪',
        category: '哲学',
        tags: ['存在主义', '荒诞', '冷漠', '社会', '哲学'],
        description: '荒诞哲学的代表作，揭示人在异己的世界中的孤独。',
        cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&q=80'
    },
    {
        id: 'rec13',
        title: '追风筝的人',
        author: '卡勒德·胡赛尼',
        category: '文学',
        tags: ['救赎', '友谊', '背叛', '成长', '阿富汗'],
        description: '为你，千千万万遍，一个关于背叛与救赎的感人故事。',
        cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80'
    },
    {
        id: 'rec14',
        title: '白夜行',
        author: '东野圭吾',
        category: '悬疑',
        tags: ['推理', '人性', '黑暗', '爱情', '悬疑'],
        description: '只希望能手牵手在太阳下散步，这个象征故事内核的绝望念想。',
        cover: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=300&q=80'
    },
    {
        id: 'rec15',
        title: '解忧杂货店',
        author: '东野圭吾',
        category: '治愈',
        tags: ['温暖', '治愈', '选择', '人生', '温情'],
        description: '僻静街道旁的一家杂货店，只要写下烦恼投进卷帘门的投信口。',
        cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&q=80'
    },
    {
        id: 'rec16',
        title: '万历十五年',
        author: '黄仁宇',
        category: '历史',
        tags: ['历史', '明朝', '大历史观', '制度', '中国'],
        description: '从小事件看大历史，揭示中国传统社会的问题。',
        cover: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&q=80'
    },
    {
        id: 'rec17',
        title: '杀死一只知更鸟',
        author: '哈珀·李',
        category: '文学',
        tags: ['正义', '种族', '成长', '教育', '勇气'],
        description: '关于勇气、正义与成长的永恒经典。',
        cover: 'https://images.unsplash.com/photo-1440778303588-43aa9d7818ad?w=300&q=80'
    },
    {
        id: 'rec18',
        title: '苏菲的世界',
        author: '乔斯坦·贾德',
        category: '哲学',
        tags: ['哲学', '启蒙', '思考', '智慧', '入门'],
        description: '以小说的形式，通过一名哲学导师向一个叫苏菲的女孩传授哲学知识。',
        cover: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=300&q=80'
    },
    {
        id: 'rec19',
        title: '了不起的盖茨比',
        author: '菲茨杰拉德',
        category: '文学',
        tags: ['美国梦', '爱情', '奢华', '悲剧', '爵士时代'],
        description: '美国文学史上的经典，关于梦想、财富与爱情的悲剧。',
        cover: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300&q=80'
    },
    {
        id: 'rec20',
        title: '沉思录',
        author: '马可·奥勒留',
        category: '哲学',
        tags: ['斯多葛', '人生', '智慧', '内省', '罗马'],
        description: '古罗马皇帝的人生哲学，关于如何过一种符合理性的生活。',
        cover: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300&q=80'
    },
    {
        id: 'rec21',
        title: '红楼梦',
        author: '曹雪芹',
        category: '古典',
        tags: ['古典', '爱情', '家族', '诗词', '经典'],
        description: '中国古典小说巅峰，封建社会的百科全书。',
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80'
    },
    {
        id: 'rec22',
        title: '老人与海',
        author: '海明威',
        category: '文学',
        tags: ['坚持', '勇气', '自然', '硬汉', '诺贝尔文学奖'],
        description: '人可以被毁灭，但不能被打败，关于勇气与坚持的永恒故事。',
        cover: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&q=80'
    },
    {
        id: 'rec23',
        title: '瓦尔登湖',
        author: '梭罗',
        category: '散文',
        tags: ['自然', '简单', '生活', '哲学', '独处'],
        description: '在瓦尔登湖畔的独居生活，关于简单生活与自然的思考。',
        cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80'
    },
    {
        id: 'rec24',
        title: '乔布斯传',
        author: '沃尔特·艾萨克森',
        category: '传记',
        tags: ['创新', '领导力', '苹果', '科技', '传记'],
        description: '苹果公司创始人的官方传记，关于创新与完美主义的故事。',
        cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&q=80'
    },
    {
        id: 'rec25',
        title: '自控力',
        author: '凯利·麦格尼格尔',
        category: '心理学',
        tags: ['自律', '习惯', '意志力', '改变', '科学'],
        description: '斯坦福大学最受欢迎的心理学课程，教你如何管理自控力。',
        cover: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&q=80'
    },
    // ========== 中外文学 ==========
    {
        id: 'rec26',
        title: '白鹿原',
        author: '陈忠实',
        category: '文学',
        tags: ['家族', '历史', '乡土', '史诗', '中国'],
        description: '一部渭河平原五十年变迁的雄奇史诗，一轴中国农村斑斓多彩的画卷。',
        cover: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&q=80'
    },
    {
        id: 'rec27',
        title: '边城',
        author: '沈从文',
        category: '文学',
        tags: ['湘西', '爱情', '纯朴', '人性', '田园'],
        description: '一曲湘西牧歌，描绘了湘西地区特有的风土人情和纯真的爱情故事。',
        cover: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80'
    },
    {
        id: 'rec28',
        title: '骆驼祥子',
        author: '老舍',
        category: '文学',
        tags: ['北京', '命运', '底层', '社会', '悲剧'],
        description: '讲述人力车夫祥子三起三落的人生经历，展现旧北京底层人民的苦难生活。',
        cover: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=300&q=80'
    },
    {
        id: 'rec29',
        title: '傲慢与偏见',
        author: '简·奥斯汀',
        category: '文学',
        tags: ['爱情', '婚姻', '阶级', '英国', '经典'],
        description: '19世纪英国乡绅阶层的生活画卷，关于爱情与婚姻的永恒经典。',
        cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80'
    },
    {
        id: 'rec30',
        title: '简爱',
        author: '夏洛蒂·勃朗特',
        category: '文学',
        tags: ['女性', '独立', '爱情', '尊严', '成长'],
        description: '一个平凡女子追求独立、尊严和真爱的动人故事，女性文学的经典之作。',
        cover: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=300&q=80'
    },
    {
        id: 'rec31',
        title: '红与黑',
        author: '司汤达',
        category: '文学',
        tags: ['野心', '爱情', '社会', '法国', '批判'],
        description: '一部关于野心与爱情的悲剧，深刻揭示了复辟王朝时期法国的社会矛盾。',
        cover: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300&q=80'
    },
    {
        id: 'rec32',
        title: '巴黎圣母院',
        author: '雨果',
        category: '文学',
        tags: ['爱情', '美丑', '宗教', '法国', '哥特'],
        description: '在15世纪的巴黎圣母院，上演了一出美与丑、善与恶的永恒悲剧。',
        cover: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=300&q=80'
    },
    // ========== 科技创新 ==========
    {
        id: 'rec33',
        title: '从0到1',
        author: '彼得·蒂尔',
        category: '科技创新',
        tags: ['创业', '创新', '商业', '垄断', '未来'],
        description: 'PayPal创始人的创业哲学，揭示商业世界的运行法则和创新本质。',
        cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80'
    },
    {
        id: 'rec34',
        title: '黑客与画家',
        author: '保罗·格雷厄姆',
        category: '科技创新',
        tags: ['编程', '创业', '硅谷', '思考', '技术'],
        description: '硅谷创业教父的文集，关于编程、创业、财富与设计的深刻洞见。',
        cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80'
    },
    {
        id: 'rec35',
        title: '浪潮之巅',
        author: '吴军',
        category: '科技创新',
        tags: ['科技', 'IT', '商业', '历史', '趋势'],
        description: '深度剖析IT产业的发展规律，揭示科技公司的兴衰成败之道。',
        cover: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80'
    },
    {
        id: 'rec36',
        title: '未来简史',
        author: '尤瓦尔·赫拉利',
        category: '科技创新',
        tags: ['未来', '科技', '人类', 'AI', '进化'],
        description: '人类将面临怎样的未来？从智人到智神，探索人类的终极命运。',
        cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80'
    },
    {
        id: 'rec37',
        title: '创新者的窘境',
        author: '克莱顿·克里斯坦森',
        category: '科技创新',
        tags: ['创新', '管理', '商业', '颠覆', '战略'],
        description: '商业管理经典，揭示为什么优秀企业在面对颠覆性创新时会失败。',
        cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80'
    },
    {
        id: 'rec38',
        title: '奇点临近',
        author: '雷·库兹韦尔',
        category: '科技创新',
        tags: ['AI', '未来', '技术', '人类', '预测'],
        description: '探讨人工智能超越人类智能的未来，科技奇点的到来意味着什么。',
        cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&q=80'
    },
    // ========== 金融相关 ==========
    {
        id: 'rec39',
        title: '穷爸爸富爸爸',
        author: '罗伯特·清崎',
        category: '金融',
        tags: ['理财', '财商', '投资', '思维', '财富'],
        description: '财商教育经典，揭示富人和穷人不同的金钱观和理财思维。',
        cover: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&q=80'
    },
    {
        id: 'rec40',
        title: '原则',
        author: '瑞·达利欧',
        category: '金融',
        tags: ['投资', '管理', '决策', '生活', '原则'],
        description: '桥水基金创始人的生活和工作原则，关于如何做出更好的决策。',
        cover: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&q=80'
    },
    {
        id: 'rec41',
        title: '聪明的投资者',
        author: '本杰明·格雷厄姆',
        category: '金融',
        tags: ['投资', '股票', '价值', '理财', '经典'],
        description: '价值投资圣经，股神巴菲特的老师传授的投资智慧和原则。',
        cover: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=300&q=80'
    },
    {
        id: 'rec42',
        title: '漫步华尔街',
        author: '伯顿·马尔基尔',
        category: '金融',
        tags: ['投资', '股市', '理财', '策略', '长期'],
        description: '投资入门的经典教材，指导如何在股市中进行理性投资。',
        cover: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300&q=80'
    },
    {
        id: 'rec43',
        title: '货币战争',
        author: '宋鸿兵',
        category: '金融',
        tags: ['货币', '金融', '历史', '经济', '国际'],
        description: '揭示国际金融资本的运作规律，探讨货币背后的权力博弈。',
        cover: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&q=80'
    },
    {
        id: 'rec44',
        title: '小狗钱钱',
        author: '博多·舍费尔',
        category: '金融',
        tags: ['理财', '儿童', '故事', '财商', '入门'],
        description: '用生动的童话故事讲述理财知识，适合理财入门的读者。',
        cover: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=300&q=80'
    },
    {
        id: 'rec45',
        title: '巴菲特致股东的信',
        author: '沃伦·巴菲特',
        category: '金融',
        tags: ['投资', '价值', '股票', '智慧', '长期'],
        description: '投资大师每年写给股东的信，记录了他50多年的投资智慧。',
        cover: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300&q=80'
    }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadNotes();
    generateRecommendations();
});

// 生成推荐
function generateRecommendations() {
    const notes = getNotes();
    const recommendationSection = document.getElementById('recommendation-section');
    
    if (!recommendationSection) return;
    
    if (notes.length === 0) {
        recommendationSection.style.display = 'none';
        return;
    }
    
    recommendationSection.style.display = 'block';
    
    // 分析用户的阅读偏好
    const userPreferences = analyzeUserPreferences(notes);
    
    // 获取推荐书籍
    const recommendations = getBookRecommendations(userPreferences, notes);
    
    // 渲染推荐
    renderRecommendations(recommendations);
}

// 分析用户阅读偏好
function analyzeUserPreferences(notes) {
    const preferences = {
        authors: {},
        tags: {},
        categories: {}
    };
    
    notes.forEach(note => {
        // 分析作者
        if (note.author && note.author !== '未知作者') {
            preferences.authors[note.author] = (preferences.authors[note.author] || 0) + 1;
        }
        
        // 分析笔记内容中的关键词
        const content = stripHtml(note.content).toLowerCase();
        const keywords = [
            '人生', '成长', '爱情', '哲学', '历史', '科幻', '文学', '艺术',
            '孤独', '梦想', '自由', '思考', '现实', '未来', '自然', '治愈',
            '勇气', '坚持', '智慧', '真理', '探索', '生命', '命运', '社会'
        ];
        
        keywords.forEach(keyword => {
            if (content.includes(keyword)) {
                preferences.tags[keyword] = (preferences.tags[keyword] || 0) + 1;
            }
        });
    });
    
    return preferences;
}

// 获取推荐书籍
function getBookRecommendations(preferences, userNotes) {
    const userBookTitles = userNotes.map(n => n.title.toLowerCase());
    
    // 计算每本书的推荐分数
    const scoredBooks = BOOK_RECOMMENDATIONS.map(book => {
        let score = 0;
        
        // 根据作者偏好加分
        if (preferences.authors[book.author]) {
            score += preferences.authors[book.author] * 3;
        }
        
        // 根据标签匹配加分
        book.tags.forEach(tag => {
            if (preferences.tags[tag]) {
                score += preferences.tags[tag] * 2;
            }
        });
        
        // 随机因子（让推荐更多样化）
        score += Math.random() * 2;
        
        return { ...book, score };
    });
    
    // 过滤掉用户已经读过的书，按分数排序，取前4本
    return scoredBooks
        .filter(book => !userBookTitles.includes(book.title.toLowerCase()))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
}

// 渲染推荐
function renderRecommendations(recommendations) {
    const container = document.getElementById('recommendation-list');
    
    if (!container) return;
    
    if (recommendations.length === 0) {
        container.innerHTML = '<p class="no-recommendations">暂无推荐，多写几篇笔记后就能获得个性化推荐啦！</p>';
        return;
    }
    
    container.innerHTML = recommendations.map(book => `
        <div class="recommendation-card">
            <div class="rec-cover" style="background-image: url('${book.cover}')">
                <span class="rec-category">${book.category}</span>
            </div>
            <div class="rec-content">
                <h4 class="rec-title">${escapeHtml(book.title)}</h4>
                <p class="rec-author">${escapeHtml(book.author)}</p>
                <p class="rec-description">${escapeHtml(book.description)}</p>
                <div class="rec-tags">
                    ${book.tags.slice(0, 3).map(tag => `<span class="rec-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// 加载笔记列表
function loadNotes() {
    const notes = getNotes();
    const notesList = document.getElementById('notes-list');
    const emptyState = document.getElementById('empty-state');
    
    if (notes.length === 0) {
        notesList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    notesList.innerHTML = notes.map(note => createNoteCard(note)).join('');
}

// 获取所有笔记
function getNotes() {
    const notes = localStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
}

// 创建笔记卡片 HTML
function createNoteCard(note) {
    const excerpt = stripHtml(note.content).substring(0, 100) + '...';
    const coverStyle = note.cover ? `background-image: url('${note.cover}')` : '';
    const date = new Date(note.createdAt).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `
        <div class="note-card" onclick="showDetail('${note.id}')">
            <div class="note-cover" style="${coverStyle}"></div>
            <div class="note-content">
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <p class="note-author">作者: ${escapeHtml(note.author)}</p>
                <p class="note-excerpt">${escapeHtml(excerpt)}</p>
                <p class="note-date">${date}</p>
            </div>
        </div>
    `;
}

// 显示编辑器
function showEditor() {
    currentNoteId = null;
    currentCoverImage = '';
    document.getElementById('book-title').value = '';
    document.getElementById('book-author').value = '';
    document.getElementById('editor').innerHTML = '';
    document.getElementById('cover-preview').style.backgroundImage = '';
    document.getElementById('cover-preview').classList.remove('has-image');
    document.getElementById('editor-modal').style.display = 'flex';
}

// 关闭编辑器
function closeEditor() {
    document.getElementById('editor-modal').style.display = 'none';
    currentCoverImage = '';
    currentNoteId = null;
}

// 保存笔记
function saveNote() {
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();
    const content = document.getElementById('editor').innerHTML;
    
    if (!title) {
        alert('请输入书名');
        return;
    }
    
    if (!content.trim()) {
        alert('请输入笔记内容');
        return;
    }
    
    const note = {
        id: currentNoteId || Date.now().toString(),
        title: title,
        author: author || '未知作者',
        content: content,
        cover: currentCoverImage,
        createdAt: currentNoteId ? getNoteById(currentNoteId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const notes = getNotes();
    
    if (currentNoteId) {
        const index = notes.findIndex(n => n.id === currentNoteId);
        if (index !== -1) {
            notes[index] = note;
        }
    } else {
        notes.unshift(note);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    loadNotes();
    
    // 保存后重新生成推荐
    generateRecommendations();
    
    closeEditor();
    
    alert('笔记保存成功！');
}

// 显示笔记详情
function showDetail(id) {
    const note = getNoteById(id);
    if (!note) return;
    
    currentNoteId = id;
    
    document.getElementById('detail-title').textContent = note.title;
    document.getElementById('detail-author').textContent = note.author;
    document.getElementById('detail-date').textContent = new Date(note.createdAt).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('detail-content').innerHTML = note.content;
    
    const coverContainer = document.getElementById('detail-cover');
    if (note.cover) {
        coverContainer.innerHTML = `<img src="${note.cover}" alt="${note.title}">`;
    } else {
        coverContainer.innerHTML = '';
    }
    
    document.getElementById('detail-modal').style.display = 'flex';
}

// 关闭详情页
function closeDetail() {
    document.getElementById('detail-modal').style.display = 'none';
    currentNoteId = null;
}

// 删除当前笔记
function deleteCurrentNote() {
    if (!currentNoteId) return;
    
    if (!confirm('确定要删除这条笔记吗？此操作不可撤销。')) {
        return;
    }
    
    const notes = getNotes().filter(n => n.id !== currentNoteId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    loadNotes();
    
    // 删除后重新生成推荐
    generateRecommendations();
    
    closeDetail();
    
    alert('笔记已删除');
}

// 根据 ID 获取笔记
function getNoteById(id) {
    return getNotes().find(n => n.id === id);
}

// 格式化文本
function formatText(command) {
    document.execCommand(command, false, null);
    document.getElementById('editor').focus();
}

// 处理封面上传
function handleCoverUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentCoverImage = e.target.result;
        const preview = document.getElementById('cover-preview');
        preview.style.backgroundImage = `url('${currentCoverImage}')`;
        preview.classList.add('has-image');
    };
    reader.readAsDataURL(file);
}

// 处理内容图片上传
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        
        const editor = document.getElementById('editor');
        editor.focus();
        
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.insertNode(img);
            range.collapse(false);
        } else {
            editor.appendChild(img);
        }
        
        // 添加换行
        const br = document.createElement('br');
        editor.appendChild(br);
    };
    reader.readAsDataURL(file);
    
    // 清空 input 以便可以再次选择同一文件
    event.target.value = '';
}

// 工具函数：去除 HTML 标签
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// 工具函数：转义 HTML 特殊字符
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 点击弹窗外部关闭
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        if (event.target.id === 'editor-modal') {
            closeEditor();
        } else if (event.target.id === 'detail-modal') {
            closeDetail();
        }
    }
};

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeEditor();
        closeDetail();
    }
});