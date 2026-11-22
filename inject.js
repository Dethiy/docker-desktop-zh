(function () {
  if (window.__dockerCN && window.__dockerCN.version) return 'already:' + window.__dockerCN.version;

  const DICT = {
    // ---- 左侧导航 ----
    'Containers': '容器',
    'Images': '镜像',
    'Logs': '日志',
    'Volumes': '数据卷',
    'Builds': '构建',
    'MCP Toolkit': 'MCP 工具包',
    'Extensions': '扩展',
    'Kubernetes': 'Kubernetes',
    'Docker Hub': 'Docker Hub',

    // ---- 顶栏 ----
    'Search': '搜索',
    'Sign in': '登录',
    'Settings': '设置',
    'Notifications': '通知',
    'Troubleshoot': '故障排查',
    'Update available': '有可用更新',
    'Give feedback': '反馈问题',
    'Learning center': '学习中心',
    'Menu': '菜单',
    'personal': '个人版',
    'Beta': '测试版',
    'Terminal': '终端',
    'Pause': '暂停',
    'Run': '运行',
    'Delete': '删除',
    'Close window': '关闭窗口',
    'Close terminal': '关闭终端',
    'collapse sidebar': '收起侧边栏',
    'expand': '展开',
    'open app switcher': '打开应用切换器',
    'Select all rows': '全选',
    'Select row': '选择此行',
    'Sort': '排序',
    'filter': '筛选',
    'Dismiss': '忽略',
    'Close': '关闭',
    'Apply': '应用',
    'Refresh': '刷新',
    'Copy to clipboard': '复制到剪贴板',
    'A new version is available to download': '有新版本可以下载',
    'compose stack': '编排栈',

    // ---- 底部状态栏 ----
    'Engine running': '引擎运行中',
    'CPU': 'CPU',
    'RAM': '内存',
    'Disk': '磁盘',
    'Showing': '显示',
    'items': '项',
    'lines': '行',
    'Engine disk utilization. This includes container data, images, builds, etc.': '引擎磁盘占用，包含容器数据、镜像、构建等。',
    'Engine total CPU usage. This includes containers plus overheads.': '引擎总 CPU 占用，包含容器及额外开销。',
    'Engine total memory usage. This includes containers plus overheads.': '引擎总内存占用，包含容器及额外开销。',

    // ---- 容器页 ----
    'Container CPU usage': '容器 CPU 使用情况',
    'Container memory usage': '容器内存使用情况',
    'Container ID': '容器 ID',
    'Name': '名称',
    'Image': '镜像',
    'Port(s)': '端口',
    'Last started': '上次启动',
    'Actions': '操作',
    'Only show running containers': '只显示运行中的容器',
    'Show charts': '显示图表',
    'Walkthroughs': '上手教程',
    'Multi-container applications': '多容器应用',
    'Containerize your application': '把你的应用容器化',
    'View more in the Learning center': '在学习中心查看更多',
    'Show container actions': '显示容器操作',
    'Open containers toolbar': '打开容器工具栏',
    'dismiss walkthrough lead in section': '关闭教程推荐',

    // ---- 镜像页 ----
    'Image ID': '镜像 ID',
    'Tag': '标签',
    'Created': '创建时间',
    'Size': '大小',
    'In use': '使用中',
    'Local': '本地',
    'My Hub': '我的仓库',
    'Show image actions': '显示镜像操作',
    'Open images toolbar': '打开镜像工具栏',
    'local and remote images': '本地与远程镜像',

    // ---- 数据卷 ----
    'Clone': '克隆',
    'Create': '创建',
    'Open volumes toolbar': '打开数据卷工具栏',

    // ---- 日志页 ----
    'Message': '消息',
    'Object': '对象',
    'Timestamp': '时间',
    'Stick to bottom': '固定在底部',
    'Export logs to CSV': '导出为 CSV',
    'Copy row to clipboard': '复制此行',
    'Expand row details': '展开详情',
    'Toggle case-sensitive search': '切换区分大小写',
    'Saved searches': '已保存的搜索',
    'Search logs (supports regex like "/error|warn/")': '搜索日志（支持正则，如 "/error|warn/"）',
    'Logs documentation': '日志文档',
    'logs-settings': '日志设置',
    'copy-all-logs': '复制全部日志',
    'saved-log-filters': '已保存的筛选',

    // ---- 构建页 ----
    'Build history': '构建历史',
    'Active builds': '活动构建',
    'Builder': '构建器',
    'Builder settings': '构建器设置',
    'Duration': '耗时',
    'Import builds': '导入构建',
    'No build record found': '没有构建记录',
    'Rows per page:': '每页行数：',
    'Show only my builds': '只显示我的构建',
    'Selected builder': '已选构建器',
    'Build Cloud user': '构建云用户',
    'Open builds toolbar': '打开构建工具栏',
    'Go to next page': '下一页',
    'Go to previous page': '上一页',
    "If you can't see your builds here make sure your builder instances are running.": '如果这里看不到构建记录，请确认构建器实例正在运行。',
    'Build large and multi-platform Docker images faster in Docker Build Cloud.': '在 Docker Build Cloud 中更快地构建大型和多平台镜像。',
    'To improve build speeds for you, your team, and even your CI,': '为了提升你、你的团队乃至 CI 的构建速度，',
    'try Docker Build Cloud now': '立即试用 Docker Build Cloud',

    // ---- Docker Hub ----
    'Search resources like \u201cLlama 3\u201d': '搜索资源，例如 \u201cLlama 3\u201d',
    'Loading...': '加载中...',

    // ---- 设置 ----
    'General': '常规',
    'Resources': '资源',
    'Software updates': '软件更新',
    'Builders': '构建器',
    'Beta features': '测试功能',
    'Docker Engine': 'Docker 引擎',
    'Enable Docker Extensions': '启用 Docker 扩展',
    'Show Docker Extensions system containers': '显示扩展的系统容器',
    'Only allow extensions distributed through the Docker Marketplace': '仅允许安装市场分发的扩展',
    'Displays Docker Desktop Extensions internal containers when using Docker commands.': '使用 Docker 命令时显示扩展的内部容器。',
    'Extensions run with host-level privileges': '扩展以主机级权限运行',
    'Prevents the installation of any other extension via the Extension SDK tools.': '阻止通过 Extension SDK 安装其他扩展。',
    'Turning this option off uninstalls all extensions and disables all extension features.': '关闭此选项会卸载所有扩展并禁用全部扩展功能。',
    'They can access Docker Engine, read and write to your filesystem, and install native binaries. Docker reviews Marketplace extensions but does not security-audit them. Only install extensions from publishers you trust.': '它们可以访问 Docker 引擎、读写你的文件系统并安装本机程序。Docker 会审核应用市场中的扩展，但不会对其做安全审计，请只安装你信任的发布者的扩展。',
    'Search settings': '搜索设置',
  };

  // 动态文本规则
  const UNITS = { second: '秒', minute: '分钟', hour: '小时', day: '天', week: '周', month: '个月', year: '年' };
  // 注意: replace 回调的第一个参数是完整匹配字符串, 分组从第二个参数开始
  const RULES = [
    [/^(\d+)\s+images?$/i, (m, a) => a + ' 个镜像'],
    [/^(\d+)\s+items?$/i, (m, a) => a + ' 项'],
    [/^(\d+)\s+lines?$/i, (m, a) => a + ' 行'],
    [/^(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i, (m, a, b) => a + ' ' + UNITS[b.toLowerCase()] + '前'],
    [/^Showing\s+(\d+)[\u2013\-]\s*(\d+)\s+of\s+(\d+)$/i, (m, a, b, c) => '显示 ' + a + '\u2013' + b + '，共 ' + c],
    [/^Showing\s+(\d+)\s+of\s+(\d+)$/i, (m, a, b) => '显示 ' + a + '，共 ' + b],
    [/^Disk:\s*(.+?)\s+used\s*\(limit\s*(.+?)\)$/i, (m, a, b) => '磁盘：已用 ' + a + '（上限 ' + b + '）'],
    [/^RAM\s+(.+)$/i, (m, a) => '内存 ' + a],
    [/^\((\d+)\s+CPUs?\s+available\)$/i, (m, a) => '（可用 ' + a + ' 个 CPU）'],
    [/^Last refresh:\s*(.+)$/i, (m, a) => '上次刷新：' + a],
    [/^([\d.]+ ?[KMG]B)\s*\/\s*([\d.]+ ?[KMG]B)\s+in use$/i, (m, a, b) => a + ' / ' + b + ' 已使用'],
    [/^(\d+)\s+mins?$/i, (m, a) => a + ' 分钟'],
    [/^(\d+)\s+secs?$/i, (m, a) => a + ' 秒'],
    [/^items?$/i, () => '项'],
    [/^lines?$/i, () => '行'],
  ];

  function translate(input) {
    if (!input) return null;
    const s = input.replace(/\s+/g, ' ').trim();
    if (!s) return null;
    if (Object.prototype.hasOwnProperty.call(DICT, s)) return DICT[s];
    for (let i = 0; i < RULES.length; i++) {
      const re = RULES[i][0];
      if (re.test(s)) return s.replace(re, RULES[i][1]);
    }
    return null;
  }

  let count = 0;
  const ATTRS = ['placeholder', 'aria-label', 'title'];

  function doTextNode(node) {
    const cur = node.nodeValue;
    if (!cur) return;
    if (node.__cnSrc === cur) return;
    const tr = translate(cur);
    if (tr && tr !== cur.replace(/\s+/g, ' ').trim()) {
      node.__cnSrc = cur;
      node.nodeValue = cur.replace(cur.trim(), tr);
      count++;
    }
  }

  function doAttrs(el) {
    for (let i = 0; i < ATTRS.length; i++) {
      const a = ATTRS[i];
      const v = el.getAttribute && el.getAttribute(a);
      if (!v) continue;
      const tr = translate(v);
      if (tr && tr !== v) { el.setAttribute(a, tr); count++; }
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { doTextNode(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) doAttrs(root);
    if (root.querySelectorAll) {
      const els = root.querySelectorAll('[placeholder],[aria-label],[title]');
      for (let i = 0; i < els.length; i++) doAttrs(els[i]);
    }
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    while (w.nextNode()) doTextNode(w.currentNode);
  }

  let scheduled = false;
  const pending = new Set();
  function schedule(root) {
    pending.add(root);
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      const roots = [...pending];
      pending.clear();
      for (const r of roots) { try { walk(r); } catch (e) { /* 忽略单个节点失败 */ } }
    });
  }

  // 首次全量
  walk(document.body);

  const mo = new MutationObserver((records) => {
    for (const rec of records) {
      if (rec.type === 'characterData') schedule(rec.target);
      else if (rec.type === 'childList') { for (const n of rec.addedNodes) schedule(n); }
      else if (rec.type === 'attributes') schedule(rec.target);
    }
  });
  mo.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRS,
  });

  window.__dockerCN = { version: '1.0', count, translate };
  return 'installed, translated=' + count;
})()
