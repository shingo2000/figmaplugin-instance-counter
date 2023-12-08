"use strict";
// ファイル内の全ページにわたって各コンポーネントの使用回数を集計し、CSV形式で出力する関数
function outputComponentUsageAsCSV() {
    // コンポーネントの使用回数、ライブラリ情報、ノードIDを保持するマップ
    const componentUsage = {};
    // 全ページをループ処理
    figma.root.children.forEach(page => {
        // 現在のページのすべてのノードを取得
        const allNodes = page.findAll();
        // インスタンスのみをフィルタリングし、InstanceNode 型にキャスト
        const instances = allNodes.filter(node => node.type === "INSTANCE");
        // 各インスタンスについて処理
        instances.forEach(instance => {
            const mainComponent = instance.mainComponent;
            if (mainComponent) {
                let componentName;
                // メインコンポーネントの親がコンポーネントセットの場合はその名前を使用
                if (mainComponent.parent && mainComponent.parent.type === "COMPONENT_SET") {
                    componentName = mainComponent.parent.name;
                }
                else {
                    // そうでない場合はメインコンポーネントの名前を使用
                    componentName = mainComponent.name;
                }
                // 使用回数をカウント
                if (componentUsage[componentName]) {
                    componentUsage[componentName].count += 1;
                }
                else {
                    componentUsage[componentName] = { count: 1, isRemote: mainComponent.remote, nodeId: mainComponent.id };
                }
            }
        });
    });
    // 利用回数で並べ替えてCSV形式の文字列を生成
    const sortedComponents = Object.entries(componentUsage).sort((a, b) => b[1].count - a[1].count);
    const csvContent = "Component Name,Usage Count,Is Remote,Node ID\n" + sortedComponents.map(entry => `${entry[0]},${entry[1].count},${entry[1].isRemote},${entry[1].nodeId}`).join("\n");
    // CSV出力
    console.log(csvContent);
}
// 関数を直接実行
outputComponentUsageAsCSV();
figma.notify("使用コンポーネントの一覧が出力されました。consoleから確認してください。");
figma.closePlugin();
