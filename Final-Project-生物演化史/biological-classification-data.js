const data = {
    name: "生命起源",
    time: "35亿年前",
    description: "地球上最早的生命形式",
    src: "./static/生命起源.jpg",
    description_more: "",
    children: [
        {
            name: "原核生物",
            time: "35-20亿年前",
            description: "最原始的细胞生物",
            src: "./static/原核生物.png",
            description_more: "原核生物是单细胞生物，没有真正的细胞核，只有原始的核质结构。它们通过简单的分裂方式繁殖，没有复杂的细胞器。原核生物包括细菌和古菌，是地球上最早的生命形式。",
            children: [
                {
                    name: "细菌界",
                    time: "35亿年前至今",
                    description: "包括大多数细菌",
                    src: "./static/细菌界.jpg",
                    description_more: "",
                    children: [
                        { name: "蓝细菌", time: "27亿年前", description: "能进行光合作用的细菌", src: "./static/蓝细菌.png", description_more: "" },
                        { name: "放线菌", time: "20亿年前", description: "具有丝状体的细菌", src: "./static/放线菌.jpg", description_more: "" },
                        { name: "螺旋菌", time: "20亿年前", description: "螺旋形的细菌", src: "./static/螺旋菌.jpg", description_more: "" },
                        {
                            name: "革兰氏阳性细菌",
                            time: "18亿年前",
                            description: "细胞壁厚常见于土壤和植物体内。",
                            src: "./static/革兰氏阳性细菌.jpg",
                            description_more: "",
                            children: [
                                { name: "链球菌", time: "12亿年前", description: "有链状排列的细菌", src: "./static/链球菌.jpg", description_more: "" },
                                { name: "葡萄球菌", time: "11亿年前", description: "有葡萄状排列的细菌", src: "./static/葡萄球菌.jpg", description_more: "" }
                            ]
                        },
                        {
                            name: "革兰氏阴性细菌",
                            time: "18亿年前",
                            description: "细胞壁较薄，常见于动物体内。",
                            src: "./static/革兰氏阴性细菌.jpg",
                            description_more: "",
                            children: [
                                { name: "大肠杆菌", time: "10亿年前", description: "常见于人类道的细菌", src: "./static/大肠杆菌.jpg", description_more: "" },
                                { name: "沙门氏菌", time: "8亿年前", description: "引起食物中毒的细菌", src: "./static/沙门氏菌.jpg", description_more: "" }
                            ]
                        }
                    ]
                },
                {
                    name: "古菌界",
                    time: "35亿年前至今",
                    description: "在极端环境中生存的微生物",
                    src: "./static/古菌界.jpg",
                    description_more: "",
                    children: [
                        { name: "嗜热古菌", time: "30亿年前", description: "在高温环境中生存", src: "./static/嗜热古菌.jpg", description_more: "" },
                        { name: "嗜盐古菌", time: "25亿年前", description: "在高盐环境中生存", src: "./static/嗜盐古菌.jpg", description_more: "" },
                        {
                            name: "甲烷古菌",
                            time: "20亿年前",
                            description: "主要产甲烷古菌",
                            src: "./static/甲烷古菌.jpg",
                            description_more: "",
                            children: [
                                { name: "产甲烷古菌", time: "18亿年前", description: "在厌氧条件下生存", src: "./static/产甲烷古菌.jpg", description_more: "" },
                                { name: "好氧甲烷古菌", time: "15亿年前", description: "在氧气存在下生存", src: "./static/好氧甲烷古菌.jpg", description_more: "" }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: "真核生物",
            time: "20亿年前",
            description: "具有细胞核的生物",
            src: "./static/真核生物.jpg",
            description_more: "",
            children: [
                {
                    name: "原生生物",
                    time: "15亿年前",
                    description: "单细胞真核生物",
                    src: "./static/原生生物.jpg",
                    description_more: "",
                    children: [
                        { name: "变形虫", time: "10亿年前", description: "能够变形状的单细胞生物", src: "./static/变形虫.png", description_more: "" },
                        { name: "草履虫", time: "10亿年前", description: "具有纤毛的单细胞生物", src: "./static/草履虫.jpg", description_more: "" },
                        {
                            name: "水绵",
                            time: "9亿年前",
                            description: "多细胞的水生生物",
                            src: "./static/水绵.jpg",
                            description_more: "",
                            children: [
                                { name: "理想水绵", time: "8亿年前", description: "常见于淡水中的水绵", src: "./static/理想水绵.png", description_more: "" },
                                { name: "须状水绵", time: "7亿年前", description: "呈须漂浮在水中的生物", src: "./static/须状水绵.jpg", description_more: "" }
                            ]
                        }
                    ]
                },
                {
                    name: "植物界",
                    time: "10亿年前",
                    description: "能进行光合作用的多细胞生物",
                    src: "./static/植物界.jpg",
                    description_more: "",
                    children: [
                        {
                            name: "藻类植物",
                            time: "10亿年前",
                            description: "水生植物",
                            src: "./static/藻类植物.jpg",
                            description_more: "",
                            children: [
                                { name: "绿藻", time: "8亿年", description: "含有叶绿素的水生植物", src: "./static/绿藻.jpg", description_more: "" },
                                { name: "褐藻", time: "8亿年前", description: "海洋中的大型藻", src: "./static/褐藻.jpg", description_more: "" },
                                { name: "红藻", time: "7亿年前", description: "深海水域生长的水生植物", src: "./static/红藻.jpg", description_more: "" }
                            ]
                        },
                        {
                            name: "陆地植物",
                            time: "4.7亿年前",
                            description: "适应陆地生活的植物",
                            src: "./static/陆地植物.jpg",
                            description_more: "",
                            children: [
                                { name: "苔藓植物", time: "4.5亿年前", description: "最早的陆地苔藓植物", src: "./static/苔藓植物.jpg", description_more: "" },
                                { name: "蕨类植物", time: "4亿年前", description: "有维管组织的无种子植物", src: "./static/蕨类植物.jpg", description_more: "" },
                                { name: "裸子植物", time: "3.5亿年前", description: "最的种子植物", src: "./static/裸子植物.jpg", description_more: "" },
                                { name: "被子植物", time: "1.4亿年前", description: "开花植物", src: "./static/被子植物.jpg", description_more: "" },
                                {
                                    name: "单子叶植物",
                                    time: "1.2亿年前",
                                    description: "一类具有单子叶特征的被子植物",
                                    src: "./static/单子叶植物.jpg",
                                    description_more: "",
                                    children: [
                                        { name: "禾本科", time: "1亿年前", description: "包括稻、麦等重要粮食作物", src: "./static/禾本科.jpg", description_more: "" },
                                        { name: "兰科", time: "9000万年前", description: "包括许多观赏性植物", src: "./static/兰科.jpg", description_more: "" }
                                    ]
                                },
                                {
                                    name: "双子叶植物",
                                    time: "1.2亿年前",
                                    description: "一类具有双子叶征的被子植物",
                                    src: "./static/双子叶植物.jpg",
                                    description_more: "",
                                    children: [
                                        { name: "豆科", time: "9000万年前", description: "包括大豆、豌豆等作物", src: "./static/豆科.jpg", description_more: "" },
                                        { name: "蔷薇科", time: "8000万年前", description: "包苹果、樱桃等果树", src: "./static/蔷薇科.jpg", description_more: "" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "动物界",
                    time: "6亿年前",
                    description: "多细胞异养生物",
                    src: "./static/动物界.png",
                    description_more: "",
                    children: [
                        {
                            name: "无脊椎动物",
                            time: "6亿年前",
                            description: "没有脊椎的动物",
                            src: "./static/无脊椎动物.png",
                            description_more: "",
                            children: [
                                { name: "海绵动物", time: "6亿年前", description: "最原始的多细胞动物", src: "./static/海绵动物.jpg", description_more: "" },
                                { name: "腔肠动物", time: "5.5亿年前", description: "具有辐射对称的动物", src: "./static/腔肠动物.jpg", description_more: "" },
                                { name: "扁形动物", time: "5亿年前", description: "具有双侧对称的原始动物", src: "./static/扁形动物.jpg", description_more: "" },
                                { name: "节动物", time: "5亿年前", description: "包括昆虫、蜘蛛等", src: "./static/节动物.jpg", description_more: "" },
                                { name: "软体动物", time: "5亿年前", description: "包括贝类、章鱼等", src: "./static/软体动物.jpg", description_more: "" },
                                {
                                    name: "棘皮动物",
                                    time: "5亿年前",
                                    description: "具有五辐射对称的海洋动物",
                                    src: "./static/棘皮动物.jpg",
                                    description_more: "",
                                    children: [
                                        { name: "海星", time: "4亿年前", description: "以五个或更多的臂组成", src: "./static/海星.jpg", description_more: "" },
                                        { name: "海胆", time: "4亿年前", description: "外壳坚硬，生活在海底", src: "./static/海胆.jpg", description_more: "" }
                                    ]
                                }
                            ]
                        },
                        {
                            name: "脊椎动物",
                            time: "5.3亿年前",
                            description: "具有脊椎的动物",
                            src: "./static/脊椎动物.jpg",
                            description_more: "",
                            children: [
                                { name: "鱼类", time: "5年前", description: "最早的脊椎动物", src: "./static/鱼类.jpg", description_more: "" },
                                { name: "两栖类", time: "3.7亿年前", description: "最早登陆的脊椎动物", src: "./static/两栖类.jpg", description_more: "" },
                                { name: "爬行类", time: "3.1亿年前", description: "完全适应陆地生活的动物", src: "./static/爬行类.jpg", description_more: "" },
                                { name: "鸟类", time: "1.5亿年前", description: "会飞的恐龙后裔", src: "./static/鸟类.jpg", description_more: "" },
                                { name: "哺乳", time: "2.2亿年前", description: "恒和哺乳的脊椎动物", src: "./static/哺乳类.jpg", description_more: "" },
                                {
                                    name: "单孔类",
                                    time: "2亿年前",
                                    description: "卵生的哺乳动物",
                                    src: "./static/单孔类.jpg",
                                    description_more: "",
                                    children: [
                                        { name: "鸭嘴兽", time: "1.5年前", description: "一种能产卵的哺乳动物", src: "./static/鸭嘴兽.jpg", description_more: "" },
                                        { name: "针鼹", time: "1.5亿年前", description: "皮肤有刺的哺乳动物", src: "./static/针鼹.jpg", description_more: "" }
                                    ]
                                },
                                {
                                    name: "有袋类",
                                    time: "1.7亿年前",
                                    description: "以育儿袋养育幼崽的哺乳动物",
                                    src: "./static/有袋类.jpg",
                                    description_more: "",
                                    children: [
                                        { name: "袋鼠", time: "5000万年前", description: "典型的有袋类动物", src: "./static/袋鼠.jpg", description_more: "" },
                                        { name: "考拉", time: "6000年前", description: "生活在澳大利亚的袋动物", src: "./static/考拉.jpg", description_more: "" }
                                    ]
                                },
                                {
                                    name: "胎盘类",
                                    time: "1.6亿年前",
                                    description: "以胎盘养育幼崽的哺乳动物",
                                    src: "./static/胎盘类.jpg",
                                    description_more: "",
                                    children: [
                                        { name: "灵长类", time: "6500万年前", description: "包括人类及其近亲", src: "./static/灵长类.jpg", description_more: "" },
                                        { name: "食肉类", time: "6000万年前", description: "包括犬、猫等", src: "./static/食肉类.jpg", description_more: "" },
                                        { name: "草食类", time: "6000万年前", description: "包括马、牛等", src: "./static/草食类.png", description_more: "" }
                                    ]
                                }
                            ]
                        },
                        {
                            name: "真界",
                            time: "10亿年前",
                            description: "异养的真核生物",
                            src: "./static/真菌界.jpg",
                            description_more: "",
                            children: [
                                { name: "子囊菌", time: "5亿年前", description: "包括母、青霉等", src: "./static/子囊菌.jpg", description_more: "" },
                                { name: "担子菌", time: "3亿年前", description: "包括蘑菇等大型真菌", src: "./static/担子菌.jpg", description_more: "" },
                                {
                                    name: "霉菌",
                                    time: "4亿年前",
                                    description: "在腐败物质上生长的真菌",
                                    src: "./static/霉菌.jpg",
                                    description_more: "",
                                    children: [
                                        { name: "青霉", time: "4亿年前", description: "常见于食物表面的霉菌", src: "./static/青霉.jpg", description_more: "" },
                                        { name: "黑霉", time: "4亿年前", description: "常见于烂食物上的霉", src: "./static/黑霉.jpg", description_more: "" }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
