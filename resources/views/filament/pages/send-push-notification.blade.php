<x-filament-panels::page>
    <form wire:submit="send" class="space-y-6">
        {{ $this->form }}

        <x-filament::actions :actions="$this->getFormActions()" style="margin-top: 1rem;"/>
    </form>
</x-filament-panels::page>