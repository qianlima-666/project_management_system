import React, { useState } from 'react'
import { Layout, Tree, Button } from 'antd'
import type { TreeDataNode, TreeProps } from 'antd';
import ChinaRegionData from '@/data/chinaRegion.json' // 省市县数据
import { SearchOutlined } from '@ant-design/icons'

const { Sider } = Layout


// 定义 SideBar 组件的 props 类型
interface SideBarProps {
    selectedChinaRegion: React.Key[];
    setSelectedChinaRegion: (keys: React.Key[]) => void;
}

const SideBar: React.FC<SideBarProps> = ({
    setSelectedChinaRegion
}) => {
    // 将省市县数据转换为 Ant Design Tree 组件需要的格式
    const regionTreeData: TreeDataNode[] =
        ChinaRegionData.map((province) => ({
            title: province.province,
            key: province.value,
            children: province.data.map((city) => ({
                title: city.city,
                key: city.value,
                children: city.dataList ? city.dataList.map((county) => ({
                    title: county.area,
                    key: county.value
                })) : []
            }))
        }))


    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]); // 用于控制树形组件的展开状态
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]); // 用于控制树形组件的选中状态
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]); // 用于控制树形组件的选择状态
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true); // 是否自动展开父节点
    const [selectValue, setSelectValue] = useState<string[]>([]);

    // 展开树形节点的回调
    const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
        // console.log('展开树形节点的回调', expandedKeysValue);
        // 如果不将 autoExpandParent 设置为 false，当子节点展开时，父节点无法折叠。
        // 或者，你也可以移除所有已展开的子节点 key。
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    // 选中树形节点的回调
    const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
        // console.log('选中树形节点的回调', checkedKeysValue);
        setCheckedKeys(checkedKeysValue as React.Key[]);

        const selectedRegionsName: string[] = [];
        // 根据选中的节点获取对应的省市县 名称
        ChinaRegionData.forEach((province) => {
            // 根据选中的节点获取对应的省 名称
            if ((checkedKeysValue as string[]).includes(province.value)) {
                selectedRegionsName.push(province.province);
            }
            province.data.forEach((city) => {
                // 根据选中的节点获取对应的市 名称
                if ((checkedKeysValue as string[]).includes(city.value)) {
                    selectedRegionsName.push(city.city);
                }
                city.dataList?.forEach((county) => {
                    // 根据选中的节点获取对应的县 名称
                    if ((checkedKeysValue as string[]).includes(county.value)) {
                        selectedRegionsName.push(county.area);
                    }
                });
            });
        });
        setSelectValue(selectedRegionsName);
    };

    // 选择树形节点的回调
    const onSelect: TreeProps['onSelect'] = (selectedKeysValue, info) => {
        // console.log('选择树形节点的回调', info);
        setSelectedKeys(selectedKeysValue);
    };


    // 设置侧边栏高度，避免过高导致滚动条不友好
    // 100vh - ant-layout-header 标签 - ant-layout-footer 标签
    const headerHeight = document.querySelector('.ant-layout-header')?.clientHeight || 0;
    const footerHeight = document.querySelector('.ant-layout-footer')?.clientHeight || 0;
    const sidebarHeight = `calc(100vh - ${headerHeight + footerHeight + 80}px)`;
    document.querySelector('.project-region-tree')?.setAttribute('style', `max-height: ${sidebarHeight}; overflow-y: auto;`);

    return (
        <Sider
            className="project-sidebar"
            width={220}
            style={{
                background: '#fff',
                padding: '20px 12px 10px 0',
                margin: '0 0 10px 0',
            }}
        >
            {/* 省市县筛选树形组件 */}
            <div style={{ fontWeight: 800, marginBottom: 12, fontSize: 16 }}>
                省市县筛选
                <Button
                    type="link"
                    onClick={() =>setSelectedChinaRegion(selectValue)}
                    icon={<SearchOutlined />}
                    style={{ float: 'right', padding: 0, fontSize: 14 }}
                />

            </div>
            <Tree
                className="project-region-tree"
                checkable
                treeData={regionTreeData}
                // =================================
                onExpand={onExpand} // 展开节点的回调
                expandedKeys={expandedKeys} // 控制展开的节点
                autoExpandParent={autoExpandParent} // 是否自动展开父节点
                onCheck={onCheck} // 选中节点的回调
                checkedKeys={checkedKeys} // 控制选中的节点
                onSelect={onSelect} // 选择节点的回调
                selectedKeys={selectedKeys} // 控制选择的节点
            // =================================
            />
        </Sider>
    )
}

export default SideBar