<?xml version="1.0" encoding="utf-8"?>
<project path="" name="YUI Extensions" author="Jack Slocum" version=".32" copyright="$projectName&#xD;&#xA;Copyright(c) 2006, $author.&#xD;&#xA;&#xD;&#xA;This code is licensed under BSD license. Use it as you wish, &#xD;&#xA;but keep this copyright intact.&#xD;&#xA;&#xD;&#xA;http://www.opensource.org/licenses/bsd-license.php" output="c:\projects\yui-ext\build\" source="False" source-dir="$output\source" minify="False" min-dir="$output\build" doc="False" doc-dir="$output\docs">
  <file name="anim\Actor.js" path="anim" />
  <file name="anim\Animator.js" path="anim" />
  <file name="data\AbstractDataModel.js" path="data" />
  <file name="data\DefaultDataModel.js" path="data" />
  <file name="data\JSONDataModel.js" path="data" />
  <file name="data\LoadableDataModel.js" path="data" />
  <file name="data\XMLDataModel.js" path="data" />
  <file name="grid\editor\CellEditor.js" path="grid\editor" />
  <file name="grid\editor\CheckboxEditor.js" path="grid\editor" />
  <file name="grid\editor\DateEditor.js" path="grid\editor" />
  <file name="grid\editor\NumberEditor.js" path="grid\editor" />
  <file name="grid\editor\SelectEditor.js" path="grid\editor" />
  <file name="grid\editor\TextEditor.js" path="grid\editor" />
  <file name="grid\AbstractColumnModel.js" path="grid" />
  <file name="grid\DefaultColumnModel.js" path="grid" />
  <file name="grid\EditorGrid.js" path="grid" />
  <file name="grid\EditorSelectionModel.js" path="grid" />
  <file name="grid\Grid.js" path="grid" />
  <file name="grid\GridDD.js" path="grid" />
  <file name="grid\GridView.js" path="grid" />
  <file name="grid\PagedGridView.js" path="grid" />
  <file name="grid\SelectionModel.js" path="grid" />
  <file name="widgets\DatePicker.js" path="widgets" />
  <file name="widgets\SplitBar.js" path="widgets" />
  <file name="widgets\TabPanel.js" path="widgets" />
  <file name="Element.js" path="" />
  <file name="EventManager.js" path="" />
  <file name="UpdateManager.js" path="" />
  <file name="yutil.js" path="" />
  <target name="Core" file="$output\yui-ext-core.js" shorthand="False" shorthand-list="YAHOO.util.Dom.setStyle&#xD;&#xA;YAHOO.util.Dom.getStyle&#xD;&#xA;YAHOO.util.Dom.getRegion&#xD;&#xA;YAHOO.util.Dom.getViewportHeight&#xD;&#xA;YAHOO.util.Dom.getViewportWidth&#xD;&#xA;YAHOO.util.Dom.get&#xD;&#xA;YAHOO.util.Dom.getXY&#xD;&#xA;YAHOO.util.Dom.setXY&#xD;&#xA;YAHOO.util.CustomEvent&#xD;&#xA;YAHOO.util.Event.addListener&#xD;&#xA;YAHOO.util.Event.getEvent&#xD;&#xA;YAHOO.util.Event.getTarget&#xD;&#xA;YAHOO.util.Event.preventDefault&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Event.stopPropagation&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Anim&#xD;&#xA;YAHOO.util.Motion&#xD;&#xA;YAHOO.util.Connect.asyncRequest&#xD;&#xA;YAHOO.util.Connect.setForm&#xD;&#xA;YAHOO.util.Dom&#xD;&#xA;YAHOO.util.Event">
    <include name="source\yutil.js" />
    <include name="source\DomHelper.js" />
    <include name="source\Element.js" />
    <include name="source\EventManager.js" />
    <include name="source\UpdateManager.js" />
  </target>
  <target name="Animator Lib" file="$output\animator-lib.js" shorthand="False" shorthand-list="YAHOO.util.Dom.setStyle&#xD;&#xA;YAHOO.util.Dom.getStyle&#xD;&#xA;YAHOO.util.Dom.getRegion&#xD;&#xA;YAHOO.util.Dom.getViewportHeight&#xD;&#xA;YAHOO.util.Dom.getViewportWidth&#xD;&#xA;YAHOO.util.Dom.get&#xD;&#xA;YAHOO.util.Dom.getXY&#xD;&#xA;YAHOO.util.Dom.setXY&#xD;&#xA;YAHOO.util.CustomEvent&#xD;&#xA;YAHOO.util.Event.addListener&#xD;&#xA;YAHOO.util.Event.getEvent&#xD;&#xA;YAHOO.util.Event.getTarget&#xD;&#xA;YAHOO.util.Event.preventDefault&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Event.stopPropagation&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Anim&#xD;&#xA;YAHOO.util.Motion&#xD;&#xA;YAHOO.util.Connect.asyncRequest&#xD;&#xA;YAHOO.util.Connect.setForm&#xD;&#xA;YAHOO.util.Dom&#xD;&#xA;YAHOO.util.Event">
    <include name="source\source\anim\Actor.js" />
    <include name="source\source\anim\Animator.js" />
  </target>
  <target name="Basic Grid w/ Paging" file="$output\basic-grid-lib.js" shorthand="False" shorthand-list="YAHOO.util.Dom.setStyle&#xD;&#xA;YAHOO.util.Dom.getStyle&#xD;&#xA;YAHOO.util.Dom.getRegion&#xD;&#xA;YAHOO.util.Dom.getViewportHeight&#xD;&#xA;YAHOO.util.Dom.getViewportWidth&#xD;&#xA;YAHOO.util.Dom.get&#xD;&#xA;YAHOO.util.Dom.getXY&#xD;&#xA;YAHOO.util.Dom.setXY&#xD;&#xA;YAHOO.util.CustomEvent&#xD;&#xA;YAHOO.util.Event.addListener&#xD;&#xA;YAHOO.util.Event.getEvent&#xD;&#xA;YAHOO.util.Event.getTarget&#xD;&#xA;YAHOO.util.Event.preventDefault&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Event.stopPropagation&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Anim&#xD;&#xA;YAHOO.util.Motion&#xD;&#xA;YAHOO.util.Connect.asyncRequest&#xD;&#xA;YAHOO.util.Connect.setForm&#xD;&#xA;YAHOO.util.Dom&#xD;&#xA;YAHOO.util.Event">
    <include name="source\grid\Grid.js" />
    <include name="source\grid\GridDD.js" />
    <include name="source\widgets\SplitBar.js" />
    <include name="source\widgets\Toolbar.js" />
    <include name="source\grid\GridView.js" />
    <include name="source\grid\PagedGridView.js" />
    <include name="source\grid\AbstractColumnModel.js" />
    <include name="source\grid\DefaultColumnModel.js" />
    <include name="source\data\AbstractDataModel.js" />
    <include name="source\data\DefaultDataModel.js" />
    <include name="source\data\LoadableDataModel.js" />
    <include name="source\data\XMLDataModel.js" />
    <include name="source\data\JSONDataModel.js" />
    <include name="source\grid\SelectionModel.js" />
  </target>
  <target name="Editor Grid" file="$output\editor-grid-lib.js" shorthand="False" shorthand-list="YAHOO.util.Dom.setStyle&#xD;&#xA;YAHOO.util.Dom.getStyle&#xD;&#xA;YAHOO.util.Dom.getRegion&#xD;&#xA;YAHOO.util.Dom.getViewportHeight&#xD;&#xA;YAHOO.util.Dom.getViewportWidth&#xD;&#xA;YAHOO.util.Dom.get&#xD;&#xA;YAHOO.util.Dom.getXY&#xD;&#xA;YAHOO.util.Dom.setXY&#xD;&#xA;YAHOO.util.CustomEvent&#xD;&#xA;YAHOO.util.Event.addListener&#xD;&#xA;YAHOO.util.Event.getEvent&#xD;&#xA;YAHOO.util.Event.getTarget&#xD;&#xA;YAHOO.util.Event.preventDefault&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Event.stopPropagation&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Anim&#xD;&#xA;YAHOO.util.Motion&#xD;&#xA;YAHOO.util.Connect.asyncRequest&#xD;&#xA;YAHOO.util.Connect.setForm&#xD;&#xA;YAHOO.util.Dom&#xD;&#xA;YAHOO.util.Event">
    <include name="source\grid\Grid.js" />
    <include name="source\grid\GridDD.js" />
    <include name="source\widgets\SplitBar.js" />
    <include name="source\grid\GridView.js" />
    <include name="source\widgets\Toolbar.js" />
    <include name="source\grid\PagedGridView.js" />
    <include name="source\grid\EditorGrid.js" />
    <include name="source\grid\AbstractColumnModel.js" />
    <include name="source\grid\DefaultColumnModel.js" />
    <include name="source\data\AbstractDataModel.js" />
    <include name="source\data\DefaultDataModel.js" />
    <include name="source\data\LoadableDataModel.js" />
    <include name="source\data\XMLDataModel.js" />
    <include name="source\data\JSONDataModel.js" />
    <include name="source\grid\SelectionModel.js" />
    <include name="source\grid\EditorSelectionModel.js" />
    <include name="source\grid\editor\CellEditor.js" />
    <include name="source\grid\editor\CheckboxEditor.js" />
    <include name="source\grid\editor\DateEditor.js" />
    <include name="source\grid\editor\NumberEditor.js" />
    <include name="source\widgets\DatePicker.js" />
    <include name="source\grid\editor\SelectEditor.js" />
    <include name="source\grid\editor\TextEditor.js" />
  </target>
  <target name="Tabs Only" file="$output\tabs-lib.js" shorthand="False" shorthand-list="YAHOO.util.Dom.setStyle&#xD;&#xA;YAHOO.util.Dom.getStyle&#xD;&#xA;YAHOO.util.Dom.getRegion&#xD;&#xA;YAHOO.util.Dom.getViewportHeight&#xD;&#xA;YAHOO.util.Dom.getViewportWidth&#xD;&#xA;YAHOO.util.Dom.get&#xD;&#xA;YAHOO.util.Dom.getXY&#xD;&#xA;YAHOO.util.Dom.setXY&#xD;&#xA;YAHOO.util.CustomEvent&#xD;&#xA;YAHOO.util.Event.addListener&#xD;&#xA;YAHOO.util.Event.getEvent&#xD;&#xA;YAHOO.util.Event.getTarget&#xD;&#xA;YAHOO.util.Event.preventDefault&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Event.stopPropagation&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Anim&#xD;&#xA;YAHOO.util.Motion&#xD;&#xA;YAHOO.util.Connect.asyncRequest&#xD;&#xA;YAHOO.util.Connect.setForm&#xD;&#xA;YAHOO.util.Dom&#xD;&#xA;YAHOO.util.Event">
    <include name="source\widgets\TabPanel.js" />
  </target>
  <target name="SplitBar Only" file="$output\splitbar-lib.js" shorthand="False" shorthand-list="YAHOO.util.Dom.setStyle&#xD;&#xA;YAHOO.util.Dom.getStyle&#xD;&#xA;YAHOO.util.Dom.getRegion&#xD;&#xA;YAHOO.util.Dom.getViewportHeight&#xD;&#xA;YAHOO.util.Dom.getViewportWidth&#xD;&#xA;YAHOO.util.Dom.get&#xD;&#xA;YAHOO.util.Dom.getXY&#xD;&#xA;YAHOO.util.Dom.setXY&#xD;&#xA;YAHOO.util.CustomEvent&#xD;&#xA;YAHOO.util.Event.addListener&#xD;&#xA;YAHOO.util.Event.getEvent&#xD;&#xA;YAHOO.util.Event.getTarget&#xD;&#xA;YAHOO.util.Event.preventDefault&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Event.stopPropagation&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Anim&#xD;&#xA;YAHOO.util.Motion&#xD;&#xA;YAHOO.util.Connect.asyncRequest&#xD;&#xA;YAHOO.util.Connect.setForm&#xD;&#xA;YAHOO.util.Dom&#xD;&#xA;YAHOO.util.Event">
    <include name="source\widgets\SplitBar.js" />
  </target>
  <target name="Everything" file="$output\yui-ext.js" shorthand="False" shorthand-list="YAHOO.util.Dom.setStyle&#xD;&#xA;YAHOO.util.Dom.getStyle&#xD;&#xA;YAHOO.util.Dom.getRegion&#xD;&#xA;YAHOO.util.Dom.getViewportHeight&#xD;&#xA;YAHOO.util.Dom.getViewportWidth&#xD;&#xA;YAHOO.util.Dom.get&#xD;&#xA;YAHOO.util.Dom.getXY&#xD;&#xA;YAHOO.util.Dom.setXY&#xD;&#xA;YAHOO.util.CustomEvent&#xD;&#xA;YAHOO.util.Event.addListener&#xD;&#xA;YAHOO.util.Event.getEvent&#xD;&#xA;YAHOO.util.Event.getTarget&#xD;&#xA;YAHOO.util.Event.preventDefault&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Event.stopPropagation&#xD;&#xA;YAHOO.util.Event.stopEvent&#xD;&#xA;YAHOO.util.Anim&#xD;&#xA;YAHOO.util.Motion&#xD;&#xA;YAHOO.util.Connect.asyncRequest&#xD;&#xA;YAHOO.util.Connect.setForm&#xD;&#xA;YAHOO.util.Dom&#xD;&#xA;YAHOO.util.Event">
    <include name="source\yutil.js" />
    <include name="source\DomHelper.js" />
    <include name="source\Element.js" />
    <include name="source\EventManager.js" />
    <include name="source\UpdateManager.js" />
    <include name="source\widgets\TabPanel.js" />
    <include name="source\anim\Animator.js" />
    <include name="source\anim\Actor.js" />
    <include name="source\widgets\Toolbar.js" />
    <include name="source\widgets\SplitBar.js" />
    <include name="source\grid\Grid.js" />
    <include name="source\grid\GridDD.js" />
    <include name="source\grid\GridView.js" />
    <include name="source\grid\PagedGridView.js" />
    <include name="source\grid\EditorGrid.js" />
    <include name="source\grid\AbstractColumnModel.js" />
    <include name="source\grid\DefaultColumnModel.js" />
    <include name="source\data\AbstractDataModel.js" />
    <include name="source\data\DefaultDataModel.js" />
    <include name="source\data\LoadableDataModel.js" />
    <include name="source\data\XMLDataModel.js" />
    <include name="source\data\JSONDataModel.js" />
    <include name="source\grid\SelectionModel.js" />
    <include name="source\grid\EditorSelectionModel.js" />
    <include name="source\grid\editor\CellEditor.js" />
    <include name="source\grid\editor\CheckboxEditor.js" />
    <include name="source\grid\editor\DateEditor.js" />
    <include name="source\grid\editor\NumberEditor.js" />
    <include name="source\widgets\DatePicker.js" />
    <include name="source\grid\editor\SelectEditor.js" />
    <include name="source\grid\editor\TextEditor.js" />
  </target>
  <directory name="source" />
  <file name="source\anim\Actor.js" path="anim" />
  <file name="source\anim\Animator.js" path="anim" />
  <file name="source\data\AbstractDataModel.js" path="data" />
  <file name="source\data\DefaultDataModel.js" path="data" />
  <file name="source\data\JSONDataModel.js" path="data" />
  <file name="source\data\LoadableDataModel.js" path="data" />
  <file name="source\data\XMLDataModel.js" path="data" />
  <file name="source\grid\editor\CellEditor.js" path="grid\editor" />
  <file name="source\grid\editor\CheckboxEditor.js" path="grid\editor" />
  <file name="source\grid\editor\DateEditor.js" path="grid\editor" />
  <file name="source\grid\editor\NumberEditor.js" path="grid\editor" />
  <file name="source\grid\editor\SelectEditor.js" path="grid\editor" />
  <file name="source\grid\editor\TextEditor.js" path="grid\editor" />
  <file name="source\grid\AbstractColumnModel.js" path="grid" />
  <file name="source\grid\DefaultColumnModel.js" path="grid" />
  <file name="source\grid\EditorGrid.js" path="grid" />
  <file name="source\grid\EditorSelectionModel.js" path="grid" />
  <file name="source\grid\Grid.js" path="grid" />
  <file name="source\grid\GridDD.js" path="grid" />
  <file name="source\grid\GridView.js" path="grid" />
  <file name="source\grid\PagedGridView.js" path="grid" />
  <file name="source\grid\SelectionModel.js" path="grid" />
  <file name="source\widgets\DatePicker.js" path="widgets" />
  <file name="source\widgets\SplitBar.js" path="widgets" />
  <file name="source\widgets\TabPanel.js" path="widgets" />
  <file name="source\widgets\Toolbar.js" path="widgets" />
  <file name="source\Element.js" path="" />
  <file name="source\EventManager.js" path="" />
  <file name="source\UpdateManager.js" path="" />
  <file name="source\yutil.js" path="" />
  <file name="source\DomHelper.js" path="" />
</project>